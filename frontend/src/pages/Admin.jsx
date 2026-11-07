import React, { useState, useEffect } from 'react';

export default function Admin({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [properties, setProperties] = useState([]);
  
  const [form, setForm] = useState({
    plotNo: '', title: '', location: 'ALL OVER KARACHI', fullAddress: '',
    area: '', price: '', propertyType: 'House', bedrooms: '', bathrooms: '',
    description: '', features: '', ownerName: '', ownerContact: '',
    kdaAllotment: '', sbcaNoc: '', surveyNo: ''
  });
  
  const [pics, setPics] = useState([]);
  const [preview, setPreview] = useState([]);
  
  // Legal Map files state
  const [kdaFile, setKdaFile] = useState(null);
  const [sbcaFile, setSbcaFile] = useState(null);
  const [surveyFile, setSurveyFile] = useState(null);

  useEffect(()=>{
    fetch('http://sultan-backend-8bqa.onrender.com/api/properties')
      .then(r=>r.json())
      .then(d=>setProperties(d.properties || []))
      .catch(()=>{});
  }, [msg]);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  
  const handlePics = (e) => {
    const newFiles = Array.from(e.target.files);
    const combined = [...pics, ...newFiles].slice(0,10);
    setPics(combined);
    setPreview(combined.map(f => URL.createObjectURL(f)));
    e.target.value = '';
  };

  const removePic = (index) => {
    setPics(prev => prev.filter((_, i) => i !== index));
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id) => {
    if(!confirm('Delete karni he?')) return;
    await fetch(`http://sultan-backend-8bqa.onrender.com/api/properties/${id}`, { method: 'DELETE' });
    setMsg('🗑️ Deleted');
  };
  
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const data = new FormData();
      Object.keys(form).forEach(k => data.append(k, form[k]));
      
      // 10 Pics
      pics.forEach(file => data.append('propertyImages', file));
      
      // Legal Maps - NEW
      if(kdaFile) data.append('kdaMap', kdaFile);
      if(sbcaFile) data.append('sbcaNocDoc', sbcaFile);
      if(surveyFile) data.append('surveyMap', surveyFile);
      
      const res = await fetch('http://sultan-backend-8bqa.onrender.com/api/properties', { method: 'POST', body: data });
      const result = await res.json();
      
      if(res.ok){
        setMsg('✅ Upload Ho Gayi - ' + result.property.plotNo + ' - ' + result.property.images.length + ' pics + Legal Maps');
        setForm({ plotNo: '', title: '', location: 'ALL OVER KARACHI', fullAddress: '', area: '', price: '', propertyType: 'House', bedrooms: '', bathrooms: '', description: '', features: '', ownerName: '', ownerContact: '', kdaAllotment: '', sbcaNoc: '', surveyNo: '' });
        setPics([]); setPreview([]);
        setKdaFile(null); setSbcaFile(null); setSurveyFile(null);
      } else setMsg('❌ Error: ' + result.error);
    } catch(err){ setMsg('❌ Backend nahi chal raha - ' + err.message); }
    setLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="bg-black border-b border-[#C9A86A]/20 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="font-bold text-xl tracking-widest">SULTAN <span className="text-[#C9A86A]">سلطان</span> - Admin</h1>
        <button onClick={onBack} className="bg-[#C9A86A] text-black px-5 py-2 rounded-full font-bold text-sm">Back to Site</button>
      </div>
      
      <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {msg && <div className={`p-3 mb-4 rounded-xl font-bold border ${msg.includes('✅')?'bg-green-900/30 text-green-400 border-green-500/30':'bg-red-900/30 text-red-400 border-red-500/30'}`}>{msg}</div>}
          
          <form onSubmit={submit} className="bg-[#111] border border-white/10 p-6 rounded-2xl space-y-4">
            <h2 className="font-bold text-[#C9A86A] tracking-widest text-sm">ADD PROPERTY - 10 PICS + LEGAL MAPS</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <input name="plotNo" value={form.plotNo} onChange={handleChange} placeholder="Plot No - R-126" className="bg-black border border-white/10 p-3 rounded-xl outline-none" required />
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title - Luxury Villa" className="bg-black border border-white/10 p-3 rounded-xl" required />
            </div>
            
            <input name="location" value={form.location} onChange={handleChange} placeholder="ALL OVER KARACHI" className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            <input name="fullAddress" value={form.fullAddress} onChange={handleChange} placeholder="Full Address" className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            
            <div className="grid grid-cols-3 gap-3">
              <input name="area" value={form.area} onChange={handleChange} placeholder="Area" className="bg-black border border-white/10 p-3 rounded-xl" required />
              <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="bg-black border border-white/10 p-3 rounded-xl" required />
              <select name="propertyType" value={form.propertyType} onChange={handleChange} className="bg-black border border-white/10 p-3 rounded-xl">
                <option>House</option><option>Villa</option><option>Apartment</option><option>Plot</option><option>Commercial</option><option>Building</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <input name="bedrooms" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" type="number" className="bg-black border border-white/10 p-3 rounded-xl" />
              <input name="bathrooms" value={form.bathrooms} onChange={handleChange} placeholder="Bathrooms" type="number" className="bg-black border border-white/10 p-3 rounded-xl" />
            </div>
            
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Full Description..." rows="4" className="w-full bg-black border border-white/10 p-3 rounded-xl" required />
            <input name="features" value={form.features} onChange={handleChange} placeholder="Features - Corner, Park Facing" className="w-full bg-black border border-white/10 p-3 rounded-xl" />
            
            <div className="grid grid-cols-2 gap-3">
              <input name="ownerName" value={form.ownerName} onChange={handleChange} placeholder="Owner Name" className="bg-black border border-white/10 p-3 rounded-xl" />
              <input name="ownerContact" value={form.ownerContact} onChange={handleChange} placeholder="WhatsApp" className="bg-black border border-white/10 p-3 rounded-xl" />
            </div>
            
            <div className="border-t border-white/10 pt-4">
              <label className="font-bold text-sm text-[#C9A86A]">Property ke 10 Pics - Pehli Main ({pics.length}/10)</label>
              <input type="file" multiple accept="image/*" onChange={handlePics} className="w-full mt-2 bg-black border border-white/10 p-3 rounded-xl" />
              <div className="grid grid-cols-5 gap-3 mt-4">
                {preview.map((url,i)=>(
                  <div key={i} className="relative group">
                    <img src={url} className="h-24 w-full object-cover rounded-xl border-2 border-white/10 group-hover:border-[#C9A86A]/50" />
                    <span className="absolute -top-2 -left-2 bg-[#C9A86A] text-black text- w-6 h-6 flex items-center justify-center rounded-full font-black border-2 border-black">{i+1}</span>
                    <button type="button" onClick={()=>removePic(i)} className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border-2 border-black">✕</button>
                    {i===0 && <span className="absolute bottom-1 left-1 bg-black/80 text-[#C9A86A] text- px-1.5 py-0.5 rounded font-bold">MAIN</span>}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 grid grid-cols-3 gap-3">
              <input name="kdaAllotment" value={form.kdaAllotment} onChange={handleChange} placeholder="KDA Allotment No" className="bg-black border border-white/10 p-3 rounded-xl text-sm" />
              <input name="sbcaNoc" value={form.sbcaNoc} onChange={handleChange} placeholder="SBCA NOC No" className="bg-black border border-white/10 p-3 rounded-xl text-sm" />
              <input name="surveyNo" value={form.surveyNo} onChange={handleChange} placeholder="Survey No" className="bg-black border border-white/10 p-3 rounded-xl text-sm" />
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <p className="font-bold text-[#C9A86A] text-sm tracking-widest">LEGAL MAP VERIFICATION DOCS (Image/PDF)</p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text- text-gray-400">KDA Map Image</label>
                  <input type="file" onChange={e=>setKdaFile(e.target.files[0])} accept="image/*,.pdf" className="w-full mt-1 bg-black border border-white/10 p-2 rounded-xl text-xs" />
                  {kdaFile && <p className="text- text-green-400 mt-1">✓ {kdaFile.name}</p>}
                </div>
                <div>
                  <label className="text- text-gray-400">SBCA NOC Image</label>
                  <input type="file" onChange={e=>setSbcaFile(e.target.files[0])} accept="image/*,.pdf" className="w-full mt-1 bg-black border border-white/10 p-2 rounded-xl text-xs" />
                  {sbcaFile && <p className="text- text-green-400 mt-1">✓ {sbcaFile.name}</p>}
                </div>
                <div>
                  <label className="text- text-gray-400">Survey Map Image</label>
                  <input type="file" onChange={e=>setSurveyFile(e.target.files[0])} accept="image/*,.pdf" className="w-full mt-1 bg-black border border-white/10 p-2 rounded-xl text-xs" />
                  {surveyFile && <p className="text- text-green-400 mt-1">✓ {surveyFile.name}</p>}
                </div>
              </div>
            </div>
            
            <button disabled={loading} className="w-full bg-[#C9A86A] text-black py-4 rounded-xl font-black text-lg tracking-widest">
              {loading ? 'Uploading...' : `UPLOAD - ${pics.length} PICS - ALL OVER KARACHI`}
            </button>
          </form>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-5 h-fit sticky top-20">
          <h3 className="font-bold text-[#C9A86A]">Uploaded - {properties.length}</h3>
          <div className="mt-4 space-y-3 max-h- overflow-auto">
            {properties.map(p=>(
              <div key={p._id} className="bg-black border border-white/5 p-3 rounded-xl flex gap-3">
                <img src={p.mainImage} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1"><p className="font-bold text-sm">{p.plotNo}</p><p className="text-xs text-gray-400">{p.title}</p><p className="text-xs text-[#C9A86A]">{p.price} • {p.images?.length} pics</p></div>
                <button onClick={()=>handleDelete(p._id)} className="text-red-500 text-xs">Del</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}