
import * as fs from 'fs';

const data = fs.readFileSync('./alphabet-list', 'utf8');

var obj = JSON.parse(data);

const letters = JSON.parse(obj.data.letters.toUpperCase()).slice(1); // discard banned letter
const words = JSON.parse(obj.data.all_words);
const hexgrams = JSON.parse(obj.data.specific_words) ?? [];
const perfects = hexgrams.filter(  (word) => (word.length == 6));
console.log("Hexgrams: " , hexgrams.length, " Perfect: ", perfects.length);

console.log("Queen Bee points: ", JSON.parse(obj.data.total_point));
console.log("total words: ", words.length);
const mapXxToCount = new Map();
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

// print length table
// print header line
let line = "  ";
for (let i=4; i<= maxLen; i++) {
	
	const s = String(i).padStart(4,' ')
	line += (s );
}
console.log(line);

for (const l of letters) {
	let lengthMap = mapXtoMapLengthToCount.get(l);
	if (lengthMap != undefined) {
			
		let line = "" + l + " ";

		for (let i=4; i<= maxLen; i++) {
			const ct = lengthMap.get(i) ?? 0;
			const s = String(ct).padStart(4,' ')
			line += (s );
		}
		console.log(line);
	}
};

// print 2 letter counts
mapXxToCount.forEach((value, key) => {
	console.log(`${key} = ${value}`);
});


console.log("Word length hints");
for (const h of a2Length) {
	console.log(h);
}



console.log("bye");