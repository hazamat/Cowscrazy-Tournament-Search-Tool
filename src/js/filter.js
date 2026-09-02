import {globals} from "./variables.js"

export function filterByPerson(personIndex){
	globals.filteredList = globals.stored.filter((item) => {
		return (item.person == personIndex)
	})
	globals.currentPerson = personIndex
}

export function getFilterChoices(){
	globals.possibleFilters.colourTags = [... new Set(globals.filteredList.map((item)=>item.colourTags))]
	globals.possibleFilters.stringTags = [... new Set(globals.filteredList.map((item)=>item.stringTags))]
}
