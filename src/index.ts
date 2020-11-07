import bclasses from "./bclasses"
import * as cheerio from "cheerio"
import * as fs from "fs"
import * as open from "open"
import { html_editor } from "./utils"
import * as cp from "child_process"
import Axios from "axios"
import * as ora from "ora"
import * as chalk from "chalk"

export async function main() {
    // import my classes list from config.json
    let my_total_classes: bclasses[] = []
    const configJSON = require("../config.json")
    const semester = configJSON["semester"]
    const year = configJSON["year"]
    const course_list = configJSON["course_list"]
    const progress = ora(`Receiving Class Information ...\n`).start()
    //request all the course info
    // const all_course_list = JSON.parse(cp.execSync([
    //     `curl -X GET "https://www.berkeleytime.com/api/catalog/catalog_json/?form=long/"`,
    //     `-H "accept: application/json"`
    //     ].join(" "), { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }).toString())["courses"]
    
    const all_course_list_res = await Axios.get(`https://www.berkeleytime.com/api/catalog/catalog_json/?form=long/`)
    const all_course_list = await all_course_list_res.data["courses"]
    // request data and compute (for each list)
    Object.entries(course_list).map((list_info) => {
        let listname = list_info[0] as string
        let course_list = list_info[1] as string[]
        let bclass = new bclasses(semester, year, listname ,course_list, all_course_list)
        my_total_classes.push(bclass)
    })

    Promise.all(my_total_classes.map(async (bclass)=> {
        await bclass.main()
        progress.succeed(`${chalk.green(bclass.listname)} Information Received`)
    })).then(()=> {
        let output = html_editor(my_total_classes)
        fs.writeFileSync(__dirname + '/../res/output.html', output)
        open(__dirname + '/../res/output.html')
    })
}

main()

