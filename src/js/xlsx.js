const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8pNVqoOWvo_ps2ZhVu9O8dC3keUoL6EE3GTj3gnaX2sK8NTT9iAQc1aBANj4UhRthx8KR_vGzCHHO/pub?output=xlsx";

let characterList = [];
let peopleList = [];
let stored = [];
let colouredTags = [];
let stringTags = [];

let selectedPerson = "";
let selectedPersonIndex = -1;

async function getUpdatedSpreadsheet(){
	try {
		const response = await fetch(SPREADSHEET_URL)
		const array = await response.arrayBuffer()
		return array
	} catch(error) {
		console.error(error)
		return null
	}
}

async function updateData(rows){
	characterList = []
	peopleList = []
	stored = []
	colouredTags = []
	stringTags = []

	let i = 2
	while(i < rows[0].length){
		let tags = rows[0][i].content.toLowerCase().split(" AND ")
		let j = 0
		while(j < tags.length){
			tags[j] = tags[j].replace(/\s/g, '')
			j++
		}
		j = 0
		while(j < tags.length) {
			let index = colouredTags.findIndex(tagObject => tagObject.tag === tags[j])
			if(index < 0){
				let object = {
					tag: tags[j],
					colour: [rows[0][i].colour]
				}
				colouredTags.push(object)
			} else {
				colouredTags[index].colour.push(rows[0][i].colour)
			}
			j++
		}
		i++
	}
	i = 1
	while(i < rows.length){
		characterList.push({
			name: rows[i][1].content.toLowerCase().replace(/\s/g, ''),
		})
		let j = 2
		while(j < rows[i].length){
			let rowContent = rows[i][j].content.toLowerCase().replace(/\s/g, '').split(")").join('').split("(")
			let index = peopleList.indexOf(rowContent[0])
			if(index < 0){
				index = peopleList.length
				peopleList.push(rowContent[0])
			}
			let object = {
				name: characterList.length-1,
				person: index,
				stringTags: [],
				colourTags: []
			}
			let k = 1
			while(k < rowContent.length){
				let tagIndex = stringTags.indexOf(rowContent[k])
				if(tagIndex < 0){
					tagIndex = stringTags.length
					stringTags.push(rowContent[k])
				}
				object.stringTags.push(tagIndex)
				k++
			}
			k = 0
			while(k < colouredTags.length){
				if(colouredTags[k].colour.indexOf(rows[i][j].colour) >= 0) object.colourTags.push(k)
				k++
			}
			stored.push(object);
			j++
		}
		i++
	}
}

function getCharacters(personID){
	let list = []
	let i = 0
	while(i < stored.length){
		if(stored[i].person != personID){
			i++
			continue
		}
		let object = {
			name: characterList[stored[i].name].name,
			stringTags: [],
			colourTags: []
		}
		let j = 0
		while(j < stored[i].stringTags.length){
			object.stringTags.push(stringTags[stored[i].stringTags[j]])
			j++
		}
		j = 0
		while(j < stored[i].colourTags.length){
			object.colourTags.push(colouredTags[stored[i].colourTags[j]].tag)
			j++
		}
		list.push(object)
		i++
	}
	return list
}

function selectPerson(personID){
	let jsUserInputElm = document.getElementById("jsUserInput")
	jsUserInputElm.innerHTML=`<button onClick="characterSearchSetup()">Go Back To Person Select</button>`
	let showInfo = document.getElementById("showInfo")
	showInfo.innerHTML = ""
	let list = getCharacters(personID)
	let table = "<table><tr><th>Character</th><th>Colour Tags</th><th>String Tags</th></tr>"
	let i = 0
	while(i < list.length){
		table += `<tr><th>${list[i].name}</th><th>${list[i].colourTags.join(", ")}</th><th>${list[i].stringTags.join(", ")}</th></tr>`
		i++
	}
	table += "</table>"
	showInfo.innerHTML = table
}

function characterSearchSetup(){
	let jsUserInputElm = document.getElementById("jsUserInput")
	jsUserInputElm.innerHTML = ""
	let showInfo = document.getElementById("showInfo")
	showInfo.innerHTML = ""
	let table = "<table><tr><th>Select</th><th>ID</th><th>Person</th></tr>"
	let i = 0
	while(i < peopleList.length){
		table += `<tr><th><button onClick="selectPerson(${i})">Select Person</button></th><th>${i}</th><th>${peopleList[i]}</th></tr>`;
		i++
	}
	table += "</table>"
	showInfo.innerHTML = table
}

async function updateDataButton(){
	let spreadsheet_Data = await getUpdatedSpreadsheet()
	if(spreadsheet_Data == null){
		console.error("FAILED TO GET SPREADSHEET DATA")
		return
	}
	let workbook = new ExcelJS.Workbook()
	await workbook.xlsx.load(spreadsheet_Data)
	var rows = []
      	workbook.worksheets.forEach(function (sheet) {
        	sheet.eachRow(function (row, rowNumber) {
			let rowObjects = []
			let i = 0
			while(i < row._cells.length){
				let content = row._cells[i]?._value?.model?.value ?? ""
				let colour = row._cells[i]?.style?.fill?.bgColor?.argb ?? ""
				let font = row._cells[i]?.style?.font ?? null

				let object = {
					content:	content,
					colour:		colour,
					font:		font
				}
				i++
				rowObjects.push(object)
			}
			rows.push(rowObjects)
        	})
      	})

	spreadsheet_Data = null
	workbook = null
	await updateData(rows)
	rows = null

	characterSearchSetup()
}
