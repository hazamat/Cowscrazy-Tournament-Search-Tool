import {globals} from "./variables.js"
import {drawListOfStringsWithIndexWithExtra, drawListOfStringsWithIndexPagedWithExtra, drawListOfObjectsWithDefine} from "./drawLists.js"
import {drawJSButton} from "./drawButtons.js"
import {filterByPerson, getFilterChoices} from "./filter.js"

export function drawPeopleScreen(){
	let info = document.getElementById('showInfo')
	let html = drawJSButton("Switch To Page View", "drawPeopleScreenPages(0, 10)")
	function indexedButton(index, item){
		return drawJSButton("Select Person", "drawPersonScreen("+index+")")
	}
	html += drawListOfStringsWithIndexWithExtra(globals.peopleList, "People", indexedButton)
	info.innerHTML = html
}
export function drawPeopleScreenPages(pageNumber, itemsPerPage){
	let info = document.getElementById('showInfo')
	let html = drawJSButton("Switch To Full View", "drawPeopleScreen()")
	function indexedButton(index, item){
		return drawJSButton("Select Person", "drawPersonScreen("+index+")")
	}
	let totalPages = Math.ceil(globals.peopleList.length/itemsPerPage)-1
	html += drawListOfStringsWithIndexPagedWithExtra(globals.peopleList, "People", pageNumber, itemsPerPage, indexedButton)
	html += "<div>"
	html += (pageNumber != 0)? drawJSButton("Previous", "drawPeopleScreenPages(" + (pageNumber-1)+","+itemsPerPage+")") : ""
	html += "<p>Page: " + (pageNumber + 1) + '/' + totalPages +"</p>"
	html += (pageNumber < totalPages)? drawJSButton("Next", "drawPeopleScreenPages(" + (pageNumber+1)+","+itemsPerPage+")") : ""
	info.innerHTML = html
}

window.drawPeopleScreen = drawPeopleScreen
window.drawPeopleScreenPages = drawPeopleScreenPages

function createStoredCharacterTableEntry(index, item){
	let html = "<th>"+globals.characterList[item.name].name.replace(/\b\w/g, ((letter)=>letter.toUpperCase()))+"</th>"
	let colourTags = item.colourTags.map((item)=> globals.colourTags[item].tag)
	let stringTags = item.stringTags.map((item)=> globals.stringTags[item])
	html += "<th>"+((colourTags.indexOf("dead") >= 0)?"DEAD":"")+"</th>"
	html += "<th>"+((colourTags.indexOf("shiny") >= 0)?"SHINY":"")+"</th>"
	html += "<th>"+stringTags.join(", ")+"</th>"
	return html
}

export function drawPersonScreen(personIndex){
	if(personIndex != globals.currentPerson) {
		filterByPerson(personIndex)
		getFilterChoices()
	}
	console.log(globals.filteredList)
	let info = document.getElementById('showInfo')
	let html = drawJSButton("Back To Person Selection", "drawPeopleScreen()")
	html += drawListOfObjectsWithDefine(globals.filteredList, ["Character", "isDead", "isShiny", "Attributes"], createStoredCharacterTableEntry)
	info.innerHTML = html
}

window.drawPersonScreen = drawPersonScreen
