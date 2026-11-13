(function(){
'use strict';
const homeBounds=[[-35.2,16.0],[-21.7,33.6]];
const search=document.getElementById('atlas-search'), filters=document.getElementById('atlas-filters'), results=document.getElementById('atlas-results'), count=document.getElementById('atlas-count');
const sidebar=document.getElementById('atlas-sidebar'), menu=document.getElementById('atlas-menu');
const markers=[];const categoryIcons={};
layer_Geologicallandmark_5.eachLayer(function(layer){
 const p=layer.feature.properties||{};
 markers.push({layer:layer,p:p,category:String(p.CATEGORY||'')});
 if(!categoryIcons[p.CATEGORY] && layer.options.icon && layer.options.icon.options){categoryIcons[p.CATEGORY]=layer.options.icon.options.iconUrl;}
});
const categories=Array.from(new Set(markers.map(x=>x.category))).sort((a,b)=>a.localeCompare(b));
let selected=new Set(categories);
function closeMobile(){sidebar.classList.remove('is-open');menu.setAttribute('aria-expanded','false');}
function showMarker(x){
 if(!map.hasLayer(layer_Geologicallandmark_5))map.addLayer(layer_Geologicallandmark_5);
 if(!layer_Geologicallandmark_5.hasLayer(x.layer))layer_Geologicallandmark_5.addLayer(x.layer);
 const ll=x.layer.getLatLng();map.setView(ll,Math.max(map.getZoom(),8),{animate:true});
 setTimeout(function(){x.layer.openPopup();},260);closeMobile();
}
function update(){
 const q=search.value.trim().toLocaleLowerCase();let visible=[];
 markers.forEach(function(x){
 const match=selected.has(x.category)&&(!q||String(x.p.NAME||'').toLocaleLowerCase().includes(q)||String(x.p.PROVINCE||'').toLocaleLowerCase().includes(q));
 const has=layer_Geologicallandmark_5.hasLayer(x.layer);
 if(match&&!has)layer_Geologicallandmark_5.addLayer(x.layer);
 if(!match&&has)layer_Geologicallandmark_5.removeLayer(x.layer);
 if(match)visible.push(x);
 });
 visible.sort((a,b)=>Number(a.p.SITE_NO)-Number(b.p.SITE_NO));
 count.textContent=visible.length+' of '+markers.length+' sites';
 results.replaceChildren();
 if(!visible.length){const d=document.createElement('p');d.className='atlas-no-results';d.textContent='No matching sites. Try another name or category.';results.appendChild(d);return;}
 visible.forEach(function(x){
 const b=document.createElement('button');b.type='button';b.className='atlas-result';
 const img=document.createElement('img');img.src=categoryIcons[x.category]||'';img.alt='';
 const span=document.createElement('span'),name=document.createElement('strong'),meta=document.createElement('small');
 name.textContent=x.p.SITE_NO+' · '+x.p.NAME;meta.textContent=x.category+' · '+(x.p.PROVINCE||'');
 span.append(name,meta);b.append(img,span);b.addEventListener('click',()=>showMarker(x));results.appendChild(b);
 });
}
function renderFilters(){filters.replaceChildren();categories.forEach(function(c){
 const label=document.createElement('label');label.className='atlas-filter';const cb=document.createElement('input');cb.type='checkbox';cb.checked=selected.has(c);cb.value=c;cb.addEventListener('change',function(){if(cb.checked)selected.add(c);else selected.delete(c);update();});const txt=document.createElement('span');txt.textContent=c;label.append(cb,txt);filters.appendChild(label);
 });}
search.addEventListener('input',update);
document.getElementById('atlas-all').addEventListener('click',function(){selected=new Set(categories);renderFilters();update();});
document.getElementById('atlas-clear').addEventListener('click',function(){search.value='';selected=new Set(categories);renderFilters();update();});
document.getElementById('atlas-home').addEventListener('click',function(){map.closePopup();map.fitBounds(homeBounds,{padding:[24,24]});});
menu.addEventListener('click',function(){const open=sidebar.classList.toggle('is-open');menu.setAttribute('aria-expanded',String(open));});
document.getElementById('atlas-close').addEventListener('click',closeMobile);
const modal=document.getElementById('atlas-modal');
document.getElementById('atlas-about').addEventListener('click',()=>{modal.hidden=false;});
document.getElementById('atlas-modal-close').addEventListener('click',()=>{modal.hidden=true;});
modal.addEventListener('click',e=>{if(e.target===modal)modal.hidden=true;});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){modal.hidden=true;closeMobile();}});
const mapLayers={Road:layer_Road_3,Cities:layer_Cities_4,Province:layer_Province_1,SA:layer_SA_2,Neighbour:layer_Neighbourhoodcountrieds_0};
document.querySelectorAll('[data-layer]').forEach(function(cb){const layer=mapLayers[cb.dataset.layer];if(!layer)return;cb.checked=map.hasLayer(layer);cb.addEventListener('change',()=>{if(cb.checked)map.addLayer(layer);else map.removeLayer(layer);});});
L.control.scale({imperial:false,metric:true,position:'bottomright'}).addTo(map);
renderFilters();update();
map.invalidateSize();
if(!window.location.hash||window.location.hash==='#'){map.fitBounds(homeBounds,{padding:[24,24]});}
})();