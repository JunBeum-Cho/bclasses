import bclasses from "./bclasses"
import * as cheerio from "cheerio"
import * as fs from "fs"
import * as open from "open"
import { html_editor } from "./utils"

export function main() {
    let my_total_classes: { list_name: string, course: bclasses }[] = []
    // let major_classes = ["MATH 54", "IND ENG 142", "DATA 100", "ENGIN 120", "IND ENG 115", "COMPSCI W186", "KOREAN 105", "AFRICAM 134", "HISTORY 182A"]
    let major_classes = ["MATH 54"]
    let other_classes = ["COMPSCI W186", "COMPSCI 162"]
    let semester = "spring"
    let year = "2021"
    my_total_classes.push({list_name: "Major Classes", course: new bclasses(semester, year, major_classes)})
    my_total_classes.push({list_name: "Other Classes", course: new bclasses(semester, year, other_classes)})

    let output = html_editor(my_total_classes)
    fs.writeFileSync(__dirname + '/../res/output.html', output)
    open(__dirname + '/../res/output.html')
}

main()