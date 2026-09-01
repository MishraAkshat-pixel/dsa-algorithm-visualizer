const $=id=>document.getElementById(id);
let original=[42,7,19,3,25,11,31,16];
let arr=[...original], comparisons=0, moves=0, steps=0, sorting=false, paused=false, pauseResolver=null, timer=70;

const info={
 bubble:{title:"Bubble Sort",desc:"Repeatedly compares adjacent values and swaps them when they are out of order.",time:"O(n²)",space:"O(1)",code:`for i = 0 to n-1
  for j = 0 to n-i-2
    compare A[j] and A[j+1]
    if A[j] > A[j+1]
      swap A[j], A[j+1]`},
 selection:{title:"Selection Sort",desc:"Finds the smallest value in the unsorted portion and places it at the next sorted position.",time:"O(n²)",space:"O(1)",code:`for i = 0 to n-2
  min = i
  for j = i+1 to n-1
    compare A[j] and A[min]
    if A[j] < A[min]
      min = j
  swap A[i], A[min]`},
 insertion:{title:"Insertion Sort",desc:"Builds a sorted section by inserting each new value into its correct position.",time:"O(n²)",space:"O(1)",code:`for i = 1 to n-1
  key = A[i]
  j = i - 1
  while j >= 0 and A[j] > key
    move A[j] right
    j--
  insert key at j+1`},
 merge:{title:"Merge Sort",desc:"Divides the array into smaller parts, sorts them, then merges the sorted parts.",time:"O(n log n)",space:"O(n)",code:`mergeSort(A, left, right)
  if left < right
    mid = (left + right) / 2
    mergeSort(left half)
    mergeSort(right half)
    merge the two sorted halves`}
};

function render(active=[],state=""){
  const box=$("bars"); box.innerHTML="";
  const max=Math.max(...arr.map(Math.abs),1);
  arr.forEach((v,i)=>{
    const wrap=document.createElement("div"); wrap.className="bar-wrap";
    const b=document.createElement("div"); b.className="bar";
    b.style.height=`${Math.max(5,Math.abs(v)/max*88)}%`;
    if(active.includes(i)) b.classList.add(state);
    const val=document.createElement("span"); val.className="value"; val.textContent=v;
    b.appendChild(val); wrap.appendChild(b); box.appendChild(wrap);
  });
  $("arrayReadout").textContent=arr.join(", ");
}
function stats(){ $("comparisons").textContent=comparisons; $("swaps").textContent=moves; $("steps").textContent=steps; }
function setInfo(){
 const x=info[$("algorithm").value]; $("visualTitle").textContent=x.title; $("algorithmDescription").textContent=x.desc;
 $("timeComplexity").textContent=x.time; $("spaceComplexity").textContent=x.space; $("pseudocode").textContent=x.code;
}
function setMessage(text,active=[],state=""){
 $("message").textContent=text; $("explanation").textContent=text; $("stepBadge").textContent=`Step ${steps}`; $("codeLine").textContent=state?state.toUpperCase():"Ready"; render(active,state);
 stats();
}
function delay(){
 return new Promise(resolve=>{
   const run=()=>paused?(pauseResolver=run):setTimeout(resolve,timer);
   run();
 });
}
async function compare(i,j){
 comparisons++; steps++; setMessage(`Comparing ${arr[i]} and ${arr[j]}.`,[i,j],"compare"); await delay();
}
async function swap(i,j){
 [arr[i],arr[j]]=[arr[j],arr[i]]; moves++; steps++; setMessage(`Swapping ${arr[i]} and ${arr[j]}.`,[i,j],"swap"); await delay();
}
async function bubble(){
 const sorted=[];
 for(let end=arr.length-1;end>0;end--){let changed=false;
  for(let j=0;j<end;j++){await compare(j,j+1); if(arr[j]>arr[j+1]){await swap(j,j+1);changed=true}}
  sorted.push(end); render(sorted,"sorted");
  if(!changed) break;
 }
}
async function selection(){
 for(let i=0;i<arr.length-1;i++){let min=i;
  for(let j=i+1;j<arr.length;j++){await compare(min,j);if(arr[j]<arr[min])min=j}
  if(min!==i) await swap(i,min);
  render([i],"sorted");
 }
}
async function insertion(){
 for(let i=1;i<arr.length;i++){let j=i,key=arr[i];
  while(j>0){await compare(j-1,j);if(arr[j-1]<=key)break;
   arr[j]=arr[j-1]; moves++; steps++; setMessage(`Moving ${arr[j]} one position to the right.`,[j-1,j],"swap"); await delay(); j--;
  }
  arr[j]=key; render([...Array(i+1).keys()],"sorted");
 }
}
async function mergeSort(){
 async function merge(l,m,r){
  const left=arr.slice(l,m+1), right=arr.slice(m+1,r+1); let i=0,j=0,k=l;
  while(i<left.length&&j<right.length){
   comparisons++;steps++;setMessage(`Comparing ${left[i]} and ${right[j]} before merging.`,[],"compare");await delay();
   if(left[i]<=right[j])arr[k++]=left[i++];else arr[k++]=right[j++];
   moves++;steps++;setMessage(`Writing the next smallest value into position ${k-1}.`,[k-1],"swap");await delay();
  }
  while(i<left.length){arr[k++]=left[i++];moves++;steps++;render([k-1],"swap");stats();await delay()}
  while(j<right.length){arr[k++]=right[j++];moves++;steps++;render([k-1],"swap");stats();await delay()}
 }
 async function sort(l,r){if(l>=r)return;let m=Math.floor((l+r)/2);await sort(l,m);await sort(m+1,r);await merge(l,m,r)}
 await sort(0,arr.length-1);
}
async function start(){
 if(sorting)return; sorting=true; paused=false; $("start").disabled=true; $("pause").disabled=false; $("status").textContent="Running";
 const a=$("algorithm").value;
 if(a==="bubble")await bubble(); if(a==="selection")await selection(); if(a==="insertion")await insertion(); if(a==="merge")await mergeSort();
 render(arr.map((_,i)=>i),"sorted"); $("status").textContent="Sorted";$("message").textContent="Finished! Every value is now in order.";sorting=false;$("pause").disabled=true;$("start").disabled=false;
}
function apply(){
 if(sorting)return;
 const values=$("arrayInput").value.trim().split(/[\s,]+/).filter(Boolean).map(Number);
 if(values.length<2||values.length>40||values.some(v=>!Number.isFinite(v)||!Number.isInteger(v))){
  $("message").textContent="Please enter 2–40 valid integers, separated by commas or spaces.";return;
 }
 original=[...values]; reset();
 $("message").textContent="Your custom array is ready. Press Start.";
}
function reset(){
 if(sorting)return; arr=[...original];comparisons=0;moves=0;steps=0;paused=false;stats();$("status").textContent="Ready";$("stepBadge").textContent="Step 0";$("codeLine").textContent="Ready";render();setInfo();
}
function random(){
 if(sorting)return; original=Array.from({length:8+Math.floor(Math.random()*9)},()=>Math.floor(Math.random()*91)+5);$("arrayInput").value=original.join(", ");reset();
}
$("applyArray").onclick=apply;$("randomArray").onclick=random;$("reset").onclick=reset;$("start").onclick=start;
$("pause").onclick=()=>{paused=!paused;$("pause").textContent=paused?"▶ Resume":"Ⅱ Pause";if(!paused&&pauseResolver){const f=pauseResolver;pauseResolver=null;f()}$("status").textContent=paused?"Paused":"Running"};
$("algorithm").onchange=()=>{if(!sorting)setInfo()};
$("speed").oninput=e=>{timer=[0,220,130,70,35,12][e.target.value];$("speedLabel").textContent=["","Slow","Medium","Normal","Fast","Very Fast"][e.target.value]};
$("arrayInput").value=original.join(", ");setInfo();render();stats();
