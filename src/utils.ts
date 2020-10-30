import bclasses from "./bclasses"
import * as cheerio from "cheerio"
import * as fs from "fs"
import * as open from "open"

const greenlight = "&#128994;"
const yellowlight = "&#128993;"
const redlight = "&#128308;"
const whitelight = "&#9898;"

export function html_editor(classes_list: { list_name: string, course: bclasses }[]) {
    let htmlPath = __dirname + '/../res/table.html'
    let $ = cheerio.load(fs.readFileSync(htmlPath, {encoding: 'utf8'}))
    for (let value of classes_list) {
        let classes = value.course
        let classes_title = value.list_name
        let classes_title_nospace = classes_title.replace(" ", "").toLowerCase()
        let table_html = `
                            <h2 id="${classes_title_nospace}">${classes_title}</h2>
                            <table class="content-table">
                            <thead id="${classes_title_nospace}_head">
                                <tr>
                                    <th>Status</th>
                                    <th>Course number</th>
                                    <th>Course title</th>
                                    <th>Enrolled</th>
                                    <th>Waitlisted</th>
                                    <th>Accumulated class avg grade</th>
                                    <th>Most recent section avg grade</th>
                                </tr>
                            </thead>
                            <tbody id="${classes_title_nospace}_body">
                            </tbody>
                            </table>
                        `
        $(table_html).appendTo($('#cluster'))
        for (const course of Object.entries(classes.my_course_list_info)) {
            let table_row_html = ""
            if (!course[1].course_validation) {
                table_row_html = `<tr>
                                <td>${whitelight}</td>
                                <td class="italic" colspan="6"> * ${course[1].course_title} is not a valid course number</td>
                                </tr>`
            } else if (!course[1].is_offered) { 
                table_row_html = `<tr>
                                <td>${whitelight}</td>
                                <td class="italic" colspan="6"> * ${course[1].course_title} is not offered in ${classes.semester} ${classes.year}</td>
                                </tr>`
            } else {
                let sign = redlight
                if (Number(course[1].currently_waitlisted) == 0) {
                    sign = greenlight
                } else if (Number(course[1].currently_waitlisted) < Number(course[1].max_waitlisted)) {
                    sign = yellowlight
                }
                table_row_html = `<tr>
                                <td>${sign}</td>
                                <td>${course[1].course_title}</td>
                                <td class="course-title">${course[1].course_subtitle}</td>
                                <td>${course[1].currently_enrolled} / ${course[1].max_enrolled}</td>
                                <td>${course[1].currently_waitlisted} / ${course[1].max_waitlisted}</td>
                                <td>${course[1].total_class_grade}</td>
                                <td>${course[1].recent_section_grade} (${course[1].recent_section_period})</td>
                            </tr>`

            }
            $(table_row_html).appendTo($(`#${classes_title_nospace}_body`))
        }
    }
    return $.html()
}