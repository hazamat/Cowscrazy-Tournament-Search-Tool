import {globals} from "./variables.js"
import {drawPeopleScreenPages} from "./screen.js"

async function getUpdatedSpreadsheet(){
	const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8pNVqoOWvo_ps2ZhVu9O8dC3keUoL6EE3GTj3gnaX2sK8NTT9iAQc1aBANj4UhRthx8KR_vGzCHHO/pub?output=xlsx"


	try {
		const response = await fetch(SPREADSHEET_URL)
		const array = await response.arrayBuffer()
		return array
	} catch(error) {
		window.alert("An Error Occured Getting Spreadsheet:\n" + error)
		return null
	}
}

async function updateInternalData(rows){
	let characterList = []
	let peopleList = []
	let stored = []
	let colouredTags = []
	let stringTags = []

	let i = 2
	while(i < rows[0].length){
		let tags = rows[0][i].content.toLowerCase().split(" and ")
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
			isSpecial: (rows[i][1].font?.italic || rows[i][1].font?.bold)
		})
		let j = 2
		while(j < rows[i].length){
			let rowContent = rows[i][j].content.toLowerCase().replace(/\s/g, '').split(")").join('').split("(")
			if(rowContent[0] == "") {
				j++
				continue
			}
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
			let duplicates = 1
			while(k < rowContent.length){
				if(!(/^x\d+$/.test(rowContent[k]))){
					let tagIndex = stringTags.indexOf(rowContent[k])
					if(tagIndex < 0){
						tagIndex = stringTags.length
						stringTags.push(rowContent[k])
					}
					object.stringTags.push(tagIndex)
				} else {
					duplicates = Number(rowContent[k].slice(1))
				}
				k++
			}
			k = 0
			while(k < colouredTags.length){
				if(colouredTags[k].colour.indexOf(rows[i][j].colour) >= 0) object.colourTags.push(k)
				k++
			}
			k = 0
			while(k < duplicates){
				stored.push(object)
				k++
			}
			j++
		}
		i++
	}
	globals.characterList = characterList
	globals.peopleList = peopleList
	globals.stored = stored
	globals.colourTags = colouredTags
	globals.stringTags = stringTags
}

export async function updateData(){
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
	await updateInternalData(rows)
	rows = null

	drawPeopleScreenPages(0, 10)
}

window.updateData = updateData
