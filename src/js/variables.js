export let globals = {
	characterList:	[],
	peopleList:	[],
	stored:		[],
	colourTags:	[],
	stringTags:	[],
	personList:	[],
	filteredList:	[],
	currentPerson:	-1,
	possibleFilters:{
		colourTags: [],
		stringTags: []
	},
	currentFilter:	{
	        includes: {
        	        colourTags: [],
                	stringTags: [],
                	characterTags: []
        	},
        	excludes: {
        	        colourTags: [],
        	        stringTags: [],
        	        characterTags: []
        	}
	}
}
