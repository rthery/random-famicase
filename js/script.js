function qs(s){return document.getElementById(s)};
function dc(s){return document.createElement(s)};

// Seeded random number generator
function seededRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Simple string hash function for seed
function hashString(str) {
    // Remove accents, convert to lowercase, and remove spaces
    var normalized = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '');
    
    var hash = 0;
    if (normalized.length === 0) return hash;
    
    for (var i = 0; i < normalized.length; i++) {
        var char = normalized.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
}

// Seeded random function with min/max
function randSeeded(min, max, seed) {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

var tableIndex   = [23,30,46,53,58,78,63,79,89,112,149,162,165,250,261,270,253,253,252,250,255];
var lastInfo;
var startingYear = 2005;

var
fam1 = qs("fam1"),			//case image 1
fam2 = qs("fam2"),			//case image 2
fam3 = qs("fam3"),			//case image 3
fam4 = qs("fam4"),			//case image 4
load1 = qs("load1"),		 //loading gif 1
load2 = qs("load2"),		 //loading gif 2
load3 = qs("load3"),		 //loading gif 3
load4 = qs("load4"),		 //loading gif 4
source_link1 = qs("source_link1"),	//source link 1
source_link2 = qs("source_link2"),	//source link 2
source_link3 = qs("source_link3"),	//source link 3
source_link4 = qs("source_link4"),	//source link 4
translation_link1 = qs("translation_link1"), //translation link 1
translation_link2 = qs("translation_link2"), //translation link 2
translation_link3 = qs("translation_link3"), //translation link 3
translation_link4 = qs("translation_link4"); //translation link 4

fam1.onload =
fam2.onload =
fam3.onload =
fam4.onload =
function()
{
	loader(true, this.id.replace('fam', ''));
	// Show cover links when image is loaded
	this.parentElement.querySelector(".cover-links").classList.remove("hidden");
};


// Generate 4 unique random URLs with seed
function genSeededUrls(seed)
{
	var urls = [];
	var usedIndexes = [];
	
	for(var i = 0; i < 4; i++)
	{
		var url;
		var attempts = 0;
		
		do {
			url = genSingleSeededUrl(seed + i);
			attempts++;
		} while(usedIndexes.includes(url.imgUrl) && attempts < 100);
		
		usedIndexes.push(url.imgUrl);
		urls.push(url);
	}
	
	return urls;
}

// Generate single seeded URL
function genSingleSeededUrl(seedOffset)
{
	var yearInput = parseInt(qs("year").value);
	var yearIndex;

	 // Get a seeded year, or a fixed one;
	if(yearInput == -1)
	{
		yearIndex = randSeeded(0, tableIndex.length-1, seedOffset);
	}
	else if(yearInput == -2)
	{
		// Avoiding first 3 years small images
		yearIndex = randSeeded(3, tableIndex.length-1, seedOffset);
	}
	else
	{
		yearIndex = yearInput;
	}

	var imgIndex = randSeeded(1, tableIndex[yearIndex], seedOffset + 1000);
	var yearUrl  = (yearIndex+startingYear-2000).toString();

	yearUrl = minimumDigits(yearUrl,2);

	var imgUrl, pageUrl;
	var year = yearIndex+startingYear;

// Calculating the image and page url, see note on bottom

//Creating hotlinks for images >= 2008
if(year >= 2008)
{
		if(year < 2017)
		{
			imgUrl  = imgIndex.toString();
			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 2);
		}
		else if(year == 2017)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);
			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);
		}
		else if(year > 2017 && year <= 2018)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 2);
			imgUrl += "_sample";
			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);
		}
		else if(year >= 2019 && year <= 2020)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);
			imgUrl += "_sample";
			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);
		}
		else if(year >= 2021)
		{
			imgUrl = imgIndex.toString();
			imgUrl = minimumDigits(imgUrl, 3);
			pageUrl = imgIndex.toString();
			pageUrl = minimumDigits(pageUrl, 3);
		}

		return {
						imgUrl :"http://famicase.com/"+yearUrl+"/softs/"+imgUrl+".jpg",
						pageUrl:"http://famicase.com/"+yearUrl+"/softs/"+pageUrl+".html",
						year:year,
						index:imgIndex
				};
	}
	else // local link for images from 2005 to 2007
	{
			imgUrl = imgIndex.toString();
			imgUrl = "("+imgIndex+")";
			return {
							imgUrl :"./img/"+year+"/"+imgUrl+".png",
							pageUrl:null,
							year:year,
							index:imgIndex
					};
	}
}

// Change visible links URLS and load 4 images
function change(urls)
{
	// Load all 4 images
	loader(false, '1');
	loader(false, '2');
	loader(false, '3');
	loader(false, '4');
	
	// Hide all cover links initially
	qs("fam1").parentElement.querySelector(".cover-links").classList.add("hidden");
	qs("fam2").parentElement.querySelector(".cover-links").classList.add("hidden");
	qs("fam3").parentElement.querySelector(".cover-links").classList.add("hidden");
	qs("fam4").parentElement.querySelector(".cover-links").classList.add("hidden");
	
	fam1.src = urls[0].imgUrl;
	fam2.src = urls[1].imgUrl;
	fam3.src = urls[2].imgUrl;
	fam4.src = urls[3].imgUrl;

	// Set links for each individual cover
	setCoverLinks(1, urls[0]);
	setCoverLinks(2, urls[1]);
	setCoverLinks(3, urls[2]);
	setCoverLinks(4, urls[3]);

	lastInfo = urls[0];
}

// Set links for a specific cover
function setCoverLinks(index, urlData)
{
	var sourceLink = qs("source_link" + index);
	var transLink = qs("translation_link" + index);
	var coverId = qs("cover_id" + index);
	
	// Extract cover number from URL
	var coverNumber = urlData.imgUrl.match(/(\d+)\.jpg$/);
	if(coverNumber) {
		coverId.textContent = "#" + coverNumber[1];
	} else {
		coverId.textContent = "#000";
	}
	
	if(urlData.imgUrl == "https://famicase.com/softs/2025/images/000.jpg")
	{
		enableLinks(false, sourceLink, transLink);
	}
	else
	{
		sourceLink.href = urlData.pageUrl;

		// French translation (default)
		transLink.href = sourceLink.href.replace("http://","https://").replace("famicase.com","famicase-com.translate.goog")+"?_x_tr_sl=auto&_x_tr_tl=fr&_x_tr_hl=en&_x_tr_pto=wapp";

		enableLinks(true, sourceLink, transLink);
	}
}

// Show or hide loader gif
function loader(show, index)
{
	var fam = qs("fam" + index);
	var load = qs("load" + index);
	
	if(!show)
	{
		fam.style.display = "none";
		load.style.display = "inline-block";
	}
	else
	{
		fam.style.display = "inline-block";
		load.style.display = "none";
	}
}

function enableLinks(enable, sourceLink, transLink)
{
	if(enable)
	{
		sourceLink.className = "cover-link";
		transLink.className = "cover-link";
	}
	else
	{
		sourceLink.className = "cover-link disabledLink";
		transLink.className = "cover-link disabledLink";
	}
}


// Randomize button event (for title click - now works like dice button)
function randomize(data)
{
	var seed = qs("team-name").value;
	if(seed.trim() === "") {
		// If no seed, use random seed
		var randomSeed = Math.floor(Math.random() * 1000000);
		var randURLs = genSeededUrls(randomSeed);
		change(randURLs);
	} else {
		// If seed exists, use it like the dice button
		var seedHash = hashString(seed);
		var randURLs = genSeededUrls(seedHash);
		change(randURLs);
	}
}

// Randomize with seed
function randomizeWithSeed()
{
	var seed = qs("team-name").value;
	if(seed.trim() === "") {
		alert("Please enter a seed first!");
		return;
	}
	
	var seedHash = hashString(seed);
	var randURLs = genSeededUrls(seedHash);
	change(randURLs);
}

//
function minimumDigits(_value, digits)
{
	value= _value+""

	while(value.length < digits)
	{
		value = "0"+value;
	}
	return value
}





// Key press event
document.body.onkeyup = function(e){
  if (e.key == " " || e.code == "Space" || e.keyCode == 32 || e.key == "r"){
    randomize();
	}
}
