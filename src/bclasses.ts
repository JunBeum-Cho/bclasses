import * as fs from "fs"
import * as cp from "child_process"

export default class bclasses {
    public semester: string
    public year: string
    public my_course_list: string[]
    public all_course_list: string[]
    public my_course_list_ID = []
    public my_course_list_info : { [id: string]: {
        is_offered?: boolean
        course_title?: string,
        course_subtitle?: string,
        currently_enrolled?: string,
        max_enrolled?: string,
        currently_waitlisted?: string,
        max_waitlisted?: string
        recent_section_period?: string
        recent_section_grade?: string
        recent_section_id?: string
        total_class_grade?: string
    }} = {}

    constructor(semester: string, year: string, my_course_list: string[]) {
        this.semester = semester
        this.year = year
        this.my_course_list = my_course_list
        this.main()
    }

    async main () {
        this.all_course_list = JSON.parse(cp.execSync([
            `curl -X GET "https://www.berkeleytime.com/api/grades/grades_json/"`,
            `-H "accept: application/json"`
            ].join(" ")).toString())["courses"]

        for (let course of this.all_course_list) {
            this.my_course_list = this.my_course_list.map(function(course) { return course.replace(" ", "") })
            if(this.my_course_list.includes(`${course["abbreviation"]} ${course["course_number"]}`.replace(" ", ""))) {
                this.my_course_list_ID.push([course["id"], `${course["abbreviation"]} ${course["course_number"]}`])
            }
        }

        this.my_course_list_ID.map(async (courseID) => {
            this.get_enroll_info(courseID[0], courseID[1])
            this.get_gradenumber_info(courseID[0])
            this.get_grade_info(courseID[0])
        })
    }

    private get_enroll_info(courseID: string, course_name: string) {
        let course_enroll_info
        this.my_course_list_info[courseID] = {}
        try {
            course_enroll_info = JSON.parse(cp.execSync([
                `curl -X GET "https://www.berkeleytime.com/api/enrollment/aggregate/${courseID}/${this.semester}/${this.year}/"`,
                `-H "accept: application/json"`
                ].join(" ")).toString())

            this.my_course_list_info[courseID].is_offered = true
            this.my_course_list_info[courseID].course_title = course_enroll_info["title"]
            this.my_course_list_info[courseID].course_subtitle = course_enroll_info["subtitle"]
            this.my_course_list_info[courseID].currently_enrolled = course_enroll_info["data"][course_enroll_info["data"].length-1]["enrolled"]
            this.my_course_list_info[courseID].max_enrolled = course_enroll_info["data"][course_enroll_info["data"].length-1]["enrolled_max"]
            this.my_course_list_info[courseID].currently_waitlisted = course_enroll_info["data"][course_enroll_info["data"].length-1]["waitlisted"]
            this.my_course_list_info[courseID].max_waitlisted = course_enroll_info["data"][course_enroll_info["data"].length-1]["waitlisted_max"]  
        } catch {
            this.my_course_list_info[courseID].is_offered = false
            this.my_course_list_info[courseID].course_title = course_name
        }
    }

    private get_gradenumber_info(courseID: string) {
        let course_gradenumber_info = JSON.parse(cp.execSync([
            `curl -X GET curl -X GET "https://www.berkeleytime.com/api/grades/course_grades/${courseID}/"`,
            `-H "accept: application/json"`
            ].join(" ")).toString())
            
        let recent_section = course_gradenumber_info[0]
        this.my_course_list_info[courseID].recent_section_id = recent_section["grade_id"]
        this.my_course_list_info[courseID].recent_section_period = `${recent_section["semester"]} ${recent_section["year"]}`
    }

    private get_grade_info(courseID: string) {
        let course_grade_info = JSON.parse(cp.execSync([
            `curl -X GET curl -X GET "https://www.berkeleytime.com/api/grades/sections/${this.my_course_list_info[courseID].recent_section_id}/"`,
            `-H "accept: application/json"`
            ].join(" ")).toString())
        
        this.my_course_list_info[courseID].total_class_grade = course_grade_info["course_gpa"]
        this.my_course_list_info[courseID].recent_section_grade = course_grade_info["section_gpa"]
    }

    public print_all() {
    
        for (const course of Object.entries(this.my_course_list_info)) {
            if (!course[1].is_offered) {
                console.log(`${course[1].course_title} is not offered in ${this.semester} ${this.year}`)
            } else {
                console.log(course[1])
            }
        }
    }
}