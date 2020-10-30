import bclasses from "./bclasses"
import * as cheerio from "cheerio"
import * as fs from "fs"
import * as open from "open"
import { html_editor } from "./utils"

export async function main() {
    let my_total_classes: { list_name: string, course: bclasses }[] = []
    const configJSON = require("../config.json")
    const semester = configJSON["semester"]
    const year = configJSON["year"]
    const course_list = configJSON["course_list"]

    Object.entries(course_list).map(async (list_info) => {
        let list_name = list_info[0] as string
        let course_list = list_info[1] as string[]
        let bclass = new bclasses(semester, year, course_list)
        my_total_classes.push({list_name: list_name, course: bclass})
        await bclass.main()
    })

    let output = html_editor(my_total_classes)
    fs.writeFileSync(__dirname + '/../res/output.html', output)
    open(__dirname + '/../res/output.html')
}

main()

