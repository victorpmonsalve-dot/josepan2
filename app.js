async function load(){
const r=await fetch('/api/content',{cache:'no-store'});const c=await r.json();
Object.entries(c.colors||{}).forEach(([k,v])=>document.documentElement.style.setProperty('--'+k,v));
const e=id=>document.getElementById(id);
e('navBrand').textContent=c.brandName;e('footerBrand').textContent=c.brandName;e('tagline').textContent=c.tagline;e('heroTitle').textContent=c.heroTitle;e('heroText').textContent=c.heroText;e('navLogo').src=c.logo;e('heroLogo').src=c.logo;e('heroImage').src=c.heroImage;e('heroWhatsapp').href=c.whatsappLink;
['storyEyebrow','storyTitle','storyText1','storyText2','productsEyebrow','productsTitle','productsIntro','bakeryTitle','pastryTitle','galleryTitle','galleryText','contactTitle','location'].forEach(id=>e(id).textContent=c[id]||'');
e('bakeryItems').innerHTML=(c.bakeryItems||[]).map(x=>'<li>'+esc(x)+'</li>').join('');e('pastryItems').innerHTML=(c.pastryItems||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
e('galleryGrid').innerHTML=(c.gallery||[]).map(g=>`<figure class="gallery-item"><img src="${g.src}" alt="${esc(g.alt||'')}"></figure>`).join('');
e('whatsapp').textContent=c.whatsapp;e('whatsapp').href=c.whatsappLink;e('instagram').textContent=c.instagram;e('instagram').href=c.instagramLink}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}load();