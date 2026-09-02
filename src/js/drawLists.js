export function drawListOfStringsWithIndexWithExtra(list, name, func){
	let html = "<table>"
	html += "<tr><th>Index</th><th>" + name + "</th><th></th></tr>"
	let i = 0
	while(i < list.length){
		html += "<tr>"
			html += `<th>${i}</th>`
			html += `<th>${list[i]}</th>`
			html += `<th>${func(i, list[i])}</th>`
		html += "</tr>"
		i++
	}
	html += "</table>"
	return html
}

export function drawListOfStringsWithIndexPagedWithExtra(list, name, pageNumber, itemsPerPage, func){
	let html = "<table>"
	html += "<tr><th>Index</th><th>" + name + "</th><th></th></tr>"
	let len = (pageNumber*itemsPerPage)+itemsPerPage
	if(len > list.length) len = list.length
	let i = pageNumber*itemsPerPage
	while(i < len){
		html += "<tr>"
			html += `<th>${i}</th>`
			html += `<th>${list[i]}</th>`
			html += `<th>${func(i, list[i])}</th>`
		html += "</tr>"
		i++
	}
	html += "</table>"
	return html
}

export function drawListOfObjectsWithDefine(list, fields, func){
	let html = "<table><tr>"
	let i = 0
	while(i < fields.length){
		html += "<th>"+fields[i]+"</th>"
		i++
	}
	html += "</tr>"
	i = 0
	while(i < list.length){
		html += "<tr>" + func(i, list[i]) + "</tr>"
		i++
	}
	html += "</table>"
	return html
}
