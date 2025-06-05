// parse an internal file from contrabee to make a hint page

// json loader
async function getJson(url) {
	try {
		const response = await fetch(url); // {cache: 'no-cache'} https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
}

//Table utilities
// add a cell to a table row r with text s
function rowAppend(r,s) {
	const cell = document.createElement("td");
    const cellText = document.createTextNode(s);
    cell.appendChild(cellText);
    r.appendChild(cell);
}

// DIV utils
function setDivText( id, s) {
	const div = document.querySelector(id);
	div.innerHTML =s ;	
}

// Text accumulator
var hintText = ''
function clearHintText() {
	hintText = ''
}
function addline( line ) {
	hintText += line + '<br/>';
}

const jsonAlphabetList = await getJson( "https://contrabee.com/api/alphabet-list" );

const letters = JSON.parse(jsonAlphabetList.data.letters.toUpperCase()).slice(1); // discard banned letter
const words = JSON.parse(jsonAlphabetList.data.all_words);
const hexgrams = JSON.parse(jsonAlphabetList.data.specific_words) ?? [];
const perfects = hexgrams.filter(  (word) => (word.length == 6));
const points = JSON.parse(jsonAlphabetList.data.total_point);

addline("Hexgrams: " +  hexgrams.length +  " Perfect: " +  perfects.length);

addline("Contrabee Total Points: " + JSON.parse(jsonAlphabetList.data.total_point));
addline("Total Words: " +  words.length);
addline('');
addline('Length Count Table')

setDivText('#hintTotals', hintText )
clearHintText();

// map from 2 starting letters to count
const mapXxToCount = new Map();

// map from starting letter to (map from length to count)
const mapXtoMapLengthToCount = new Map();

const a2Length = []; // array for hints about length & alphabet order
let maxLen=0;

for (const w of words)  {
	//console.log( "word " , w)
	const a = w.slice(0,1);
	const ab = w.slice(0,2);
	const len = w.length;
	const hint = ab + "(" + len + ")";
	a2Length.push (hint);
	maxLen = Math.max( len, maxLen);

	mapXxToCount.set(ab, (mapXxToCount.get(ab) ?? 0) + 1);

	if (mapXtoMapLengthToCount.get(a) == undefined) {
		mapXtoMapLengthToCount.set(a, new Map());
	//	console.log("Creating length map for letter ", a);
	}
	const m = mapXtoMapLengthToCount.get(a);

	const oldCount = m.get(len) ?? 0;
	m.set( len, oldCount+1);	
};

const lengthTable = document.querySelector("#lengthTable");
const lengthTableBody = document.querySelector("#lengthTableBody");

// make first table row for header
const rowHeader = document.createElement("tr");
// blank
rowAppend(rowHeader, '');

for (let i=4; i<= maxLen; i++) {
	
	const s = String(i).padStart(4,' ');
	rowAppend(rowHeader,s);
}

lengthTableBody.appendChild(rowHeader);

for (const l of letters) {
	// make a row for this letter
	const row = document.createElement("tr");
	rowAppend(row,l);

	let lengthMap = mapXtoMapLengthToCount.get(l);
	if (lengthMap != undefined) {
			
		let line = "" + l + " ";

		for (let i=4; i<= maxLen; i++) {
			var ct = lengthMap.get(i) ?? 0;
			if (ct ==0 ) {
				ct = '-'
			}
 			rowAppend( row, ct);
			const s = String(ct).padStart(4,' ')
			line += (s );
		}
		lengthTableBody.appendChild(row);
	}
};


clearHintText();
// print 2 letter counts
addline('')
addline("Two Letter Counts");

mapXxToCount.forEach((value, key) => {
	addline(`${key} = ${value}`);
});

addline('');
setDivText('#hintTwoLetterCounts', hintText);
clearHintText();

addline("Alphabetical Word Length Hints");
for (const h of a2Length) {
	addline(h);
}
addline('');
addline("bye");

setDivText('#hintAlphabeticalLengths', hintText);
clearHintText();

export {
	jsonAlphabetList
};
