// ==UserScript==
// @name         Notion Word Count
// @namespace    elddc
// @version      1.0
// @description  Display a simple word counter in Notion
// @author       Elddc
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        none
// ==/UserScript==

//styling: modify as desired
const styles = document.createElement('style');
styles.innerHTML = `
.word-count {
  z-index: 500;
  position: absolute;
  bottom: 5px;
  right: 16px;
  font: 16px ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
}
.notion-help-button {
  bottom: 30px !important;
}
`;
document.head.appendChild(styles);

//create + insert word count element
const wordCount = document.createElement('span');
wordCount.classList.add('word-count');
document.body.appendChild(wordCount);

//fill word count element
function updateWordCount () {
	try {
		let count = document.querySelector('.notion-page-content').innerText.match(/[^\s]+/g).length;
		wordCount.innerText = `${count} word${count === 1 ? '' : 's'}`;
	} catch (err) {
		console.log('No content detected. Are you on a database page?'); //some pages do not have .notion-page-content
		wordCount.innerText = '';
	}
}

//updates word count 500 seconds after last key press
window.addEventListener('keyup', debounce(updateWordCount, 500));
setTimeout(updateWordCount, 500); //initial word count

//update word count after navigation between pages
var pushState = history.pushState;
history.pushState = function () {
	pushState.apply(history, arguments);
	setTimeout(updateWordCount, 500);
};


//helper function
//minified from https://github.com/component/debounce
function debounce(l,n,u){var e,i,t,o,f;if(null==n)n=100;function a(){var r=Date.now()-o;if(r<n&&r>=0){e=setTimeout(a,n-r)}else{e=null;if(!u){f=l.apply(t,i);t=i=null}}}var r=function(){t=this;i=arguments;o=Date.now();var r=u&&!e;if(!e)e=setTimeout(a,n);if(r){f=l.apply(t,i);t=i=null}return f};r.clear=function(){if(e){clearTimeout(e);e=null}};r.flush=function(){if(e){f=l.apply(t,i);t=i=null;clearTimeout(e);e=null}};return r}