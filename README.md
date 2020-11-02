# Bclasses README.

### What is Bclasses?

Bclasses is a UC Berkeley schedule dashboard that allows you to check out the availability of all your courses and previous grades at a single glance.
With bclasses you can create your own class dashboard.

You can check out the following: `course status`,  `course number`, `course title`, `enrollment info`, `waitlist info`, `accumulated class avg grade`, `most recent section avg grade`


## Quick Start




1. #### Install
```sh
# Needs to install nodeJS
$ brew install node@12
$ npm install
```

2. #### Change config.json
Open *config.json* and change `year`, `semester`, and `course_list` information accordingly
```sh
{
"year": "2021",
"semester": "spring",
"course_list": {
	"CORE STATISTICS COURSES" : ["Stat 133", "Stat 134", "Stat 135"],
	"STATISTICS ELECTIVES - Pick three" : ["Stat 102", "Stat 150", "Stat 151A", "Stat 152", "Stat 153", "Stat 154", "Stat 155", "Stat 156", "Stat 157", "Stat 158", "Stat 159"],
	"CLUSTER COURSES - Pick three" : ["COMPSCI W186", "COMPSCI 169", "COMPSCI 188", "COMPSCI 189", "COMPSCI 170"],
	"BREADTH COURSES" : ["HISTORY 182A", "ESPM 50AC"]
	}
}
```


4. #### Run



```sh
$ npm start
```



## Demo

![demo](https://user-images.githubusercontent.com/66484287/97833412-a20b4400-1d18-11eb-9fd0-a939cde33c55.gif)



## Credit

 - [Berkeley Time API](https://www.berkeleytime.com/apidocs) for providing UC Berkeley courses and grade information.
