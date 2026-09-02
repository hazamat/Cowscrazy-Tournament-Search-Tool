const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8pNVqoOWvo_ps2ZhVu9O8dC3keUoL6EE3GTj3gnaX2sK8NTT9iAQc1aBANj4UhRthx8KR_vGzCHHO/pub?output=xlsx"

let characterList = []
let peopleList = []
let stored = []
let colouredTags = []
let stringTags = []

let personList = []
let filteredList = []

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
}

function getHTMLForFilterOptions(viewFunctionString){
	let html = "<div><table><tr><th>Colour Tag Includes</th>"
	let i = 0 
	while (i < colouredTags.length){
		html+=`<th>
			<label for="ifc${colouredTags[i].tag}">
        			<input type="checkbox" id="ifc${colouredTags[i].tag}" name="ifc${colouredTags[i].tag}" value="no"> ${colouredTags[i].tag}
    			</label>
		</th>`
		i++
	}
	html += "</tr>"
	html += "<tr><th>String Tag Includes</th>"
	i = 0
	while (i < stringTags.length){
		html+=`<th>
			<label for="ifs${stringTags[i]}">
        			<input type="checkbox" id="ifs${stringTags[i]}" name="ifs${stringTags[i]}" value="no"> ${stringTags[i]}
    			</label>
		</th>`
		i++
	}
	html += "</tr></table>"
	html += "<div><table><tr><th>Colour Tag Excludes</th>"
	i = 0 
	while (i < colouredTags.length){
		html+=`<th>
			<label for="efc${colouredTags[i].tag}">
        			<input type="checkbox" id="efc${colouredTags[i].tag}" name="efc${colouredTags[i].tag}" value="no"> ${colouredTags[i].tag}
    			</label>
		</th>`
		i++
	}
	html += "</tr>"
	html += "<tr><th>String Tag Excludes</th>"
	i = 0
	while (i < stringTags.length){
		html+=`<th>
			<label for="efs${stringTags[i]}">
        			<input type="checkbox" id="efs${stringTags[i]}" name="efs${stringTags[i]}" value="no"> ${stringTags[i]}
    			</label>
		</th>`
		i++
	}
	html += `</tr></table>
		<button onClick="filterList(false);${viewFunctionString};">Apply Filter</button>
		<button onClick="filterList(true);${viewFunctionString};">Reset Filter</button>
	</div>`
	return html
}

function filterList(reset){
	if(reset){
		let i = 0
		while(i < colouredTags.length){
			let checkBox = document.getElementById(`ifc${colouredTags[i].tag}`)
			checkBox.checked = true
			i++
		}
		i = 0
		while(i < stringTags.length){
			let checkBox = document.getElementById(`ifs${stringTags[i]}`)
			checkBox.checked = true
			i++
		}
		i = 0
		while(i < colouredTags.length){
			let checkBox = document.getElementById(`efc${colouredTags[i].tag}`)
			checkBox.checked = false
			i++
		}
		i = 0
		while(i < stringTags.length){
			let checkBox = document.getElementById(`efs${stringTags[i]}`)
			checkBox.checked = false
			i++
		}

	}
	let i = 0
	let colourIncludes = []
	while(i < colouredTags.length){
		let checkBox = document.getElementById(`ifc${colouredTags[i].tag}`)
		if(checkBox?.checked) colourIncludes.push(colouredTags[i].tag)
		i++
	}
	i = 0
	let stringIncludes = []
	while(i < stringTags.length){
		let checkBox = document.getElementById(`ifs${stringTags[i]}`)
		if(checkBox?.checked) stringIncludes.push(stringTags[i])
		i++
	}
	 i = 0
	let colourExcludes = []
	while(i < colouredTags.length){
		let checkBox = document.getElementById(`efc${colouredTags[i].tag}`)
		if(checkBox?.checked) colourExcludes.push(colouredTags[i].tag)
		i++
	}
	i = 0
	let stringExcludes = []
	while(i < stringTags.length){
		let checkBox = document.getElementById(`efs${stringTags[i]}`)
		if(checkBox?.checked) stringExcludes.push(stringTags[i])
		i++
	}

	filteredList = []
	i = 0
	while(i < personList.length){
		let keep = false
		let j = 0
		if(colourIncludes.length == colouredTags.length){
			keep = true
		} else {
			while(j < colourIncludes.length && !keep){
				if(personList[i].colourTags.indexOf(colourIncludes[j]) >= 0) keep = true
				j++
			}
		}
		j = 0
		if(stringIncludes.length == stringTags.length){
			keep = true
		} else {
			while(j < stringIncludes.length && !keep){
				if(personList[i].stringTags.indexOf(stringIncludes[j]) >= 0) keep = true
				j++
			}
		}
		j = 0
		while(j < colourExcludes.length && keep){
			if(personList[i].colourTags.indexOf(colourExcludes[j]) >= 0) keep = false
			j++
		}
		j = 0
		while(j <stringExcludes.length && keep){
			if(personList[i].stringTags.indexOf(stringExcludes[j]) >= 0) keep = false
			j++
		}
		if(keep) filteredList.push(personList[i])
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

function setCharacterViewByPage(page){
	list = filteredList
	let jsUserInputElm = document.getElementById("jsUserInput")
	jsUserInputElm.innerHTML= ""
	let tmpHTML=`<button onClick="characterSearchSetup()">Go Back To Person Select</button>
		<button onClick="setCharacterViewFull()">Switch To Full View</button>
		<div>`
	if(page > 0) tmpHTML+=`<button onClick="setCharacterViewByPage(${page-1})">Previous</button>`
	tmpHTML+=`<p>PAGE ${page} of ${Math.ceil(list.length/10)-1}</p>`
	if(page < Math.ceil(list.length/10)-1) tmpHTML += `<button onClick="setCharacterViewByPage(${page+1})">Next</button>`
	tmpHTML+="</div>" + getHTMLForFilterOptions(`setCharacterViewByPage(${page})`)
	jsUserInputElm.innerHTML = tmpHTML
	let showInfo = document.getElementById("showInfo")
	showInfo.innerHTML = ""
	let table = "<table><tr><th>Character</th><th>Colour Tags</th><th>String Tags</th></tr>"
	let i = page*10
	while((i < (page*10)+10) && i < list.length){
		table += `<tr><th>${list[i].name}</th><th>${list[i].colourTags.join(", ")}</th><th>${list[i].stringTags.join(", ")}</th></tr>`
		i++
	}
	table += "</table>"
	showInfo.innerHTML = table
}

function setCharacterViewFull(){
	let jsUserInputElm = document.getElementById("jsUserInput")
	jsUserInputElm.innerHTML=`<button onClick="characterSearchSetup()">Go Back To Person Select</button>
		<button onClick="setCharacterViewByPage(0)">Switch To Page View</button>
	` + getHTMLForFilterOptions("setCharacterViewFull()")
	let showInfo = document.getElementById("showInfo")
	showInfo.innerHTML = ""
	list = filteredList
	let table = "<table><tr><th>Character</th><th>Colour Tags</th><th>String Tags</th></tr>"
	let i = 0
	while(i < list.length){
		table += `<tr><th>${list[i].name}</th><th>${list[i].colourTags.join(", ")}</th><th>${list[i].stringTags.join(", ")}</th></tr>`
		i++
	}
	table += "</table>"
	showInfo.innerHTML = table

}

function selectPerson(personID){
	personList = getCharacters(personID)
	filteredList = personList
	setCharacterViewFull()
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
