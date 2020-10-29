import bclasses from "./bclasses"

export async function main() {
    let my_course_list1 = ["COMPSCI 186", "COMPSCI 188", "COMPSCI 162"]
    let my_course_list2 = ["COMPSCI 186", "COMPSCI 188", "COMPSCI 162"]
    let semester = "spring"
    let year = "2021"

    let list = new bclasses(semester, year, my_course_list1)
    list.main()
    list.print_all()

    // new bclasses(semester, year, my_course_list2).main()
}

main()