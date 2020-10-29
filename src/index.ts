import bclasses from "./bclasses"
import * as cheerio from "cheerio"
import * as fs from "fs"
import * as open from "open"

const greenlight = "&#128994;"
const yellowlight = "&#128993;"
const redlight = "&#128308;"
const whitelight = "&#9898;"

export function main() {
    let major_classes = ["COMPSCI 186", "COMPSCI 188"]
    let other_classes = ["COMPSCI 186", "COMPSCI 188", "COMPSCI 162"]
    let semester = "spring"
    let year = "2021"

    let major_classes_list = new bclasses(semester, year, major_classes)
    let other_classes_list;
    let output = html_editor(major_classes_list)
    fs.writeFileSync(__dirname + '/../res/output.html', output)
    open(__dirname + '/../res/output.html')
}

export function html_editor(classes: bclasses) {
    let htmlPath = __dirname + '/../res/table.html'
    let $ = cheerio.load(fs.readFileSync(htmlPath, {encoding: 'utf8'}))

    for (const course of Object.entries(classes.my_course_list_info)) {
        let table_row = ""
        if (!course[1].is_offered) {
            table_row = `<tr>
                            <td>${whitelight}</td>
                            <td colspan="6">${course[1].course_title} is not offered in ${classes.semester} ${classes.year}</td>
                        </tr>`
        } else {
            let sign = redlight
            if (Number(course[1].currently_waitlisted) == 0) {
                sign = greenlight
            } else if (Number(course[1].currently_waitlisted) < Number(course[1].max_waitlisted)) {
                sign = yellowlight
            }
            table_row = `<tr>
                            <td>${sign}</td>
                            <td>${course[1].course_subtitle}</td>
                            <td>${course[1].course_title}</td>
                            <td>${course[1].currently_enrolled} / ${course[1].max_enrolled}</td>
                            <td>${course[1].currently_waitlisted} / ${course[1].max_waitlisted}</td>
                            <td>${course[1].total_class_grade}</td>
                            <td>${course[1].recent_section_grade} (${course[1].recent_section_period})</td>
                        </tr>`

        }
        $(table_row).appendTo($('#body'))
    }
    return $.html()
}

main()