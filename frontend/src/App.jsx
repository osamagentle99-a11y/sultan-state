import React, { useState, useEffect } from 'react';
import Admin from './pages/Admin.jsx';

export default function App(){
  const [plotNo, setPlotNo] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [properties, setProperties] = useState([]);
  const [selectedProp, setSelectedProp] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(()=>{
    fetch('http://localhost:5000/api/properties')
      .then(r=>r.json())
      .then(d=>setProperties(d.properties || []))
      .catch(()=>setProperties([]));
  }, [showAdmin]);

  const demoProps = properties.length > 0 ? properties : [
    { plotNo: "R-126", area: "240 sq yd", price: "2.5 Crore", verificationStatus: "verified", title: "Luxury Villa", mainImage: "", images: [], description: "Luxury Villa in ALL OVER KARACHI - SULTAN verified", features: ["Corner","Park Facing"], ownerName: "SULTAN", ownerContact: "03001234567", location: "ALL OVER KARACHI", kdaAllotment: "KDA-B5-2024-126", sbcaNoc: "SBCA-2024-8765", legalMaps: { kda: { verified: true }, sbca: { verified: true } } },
    { plotNo: "R-345", area: "120 sq yd", price: "1.2 Crore", verificationStatus: "pending", title: "House", mainImage: "", images: [], description: "House for sale", features: ["West Open"], ownerName: "SULTAN", ownerContact: "03001234567", location: "ALL OVER KARACHI" },
  ];

  const login = () => {
    if(pwd === 'sweet678') setAuth(true);
    else alert('Incorrect Password');
  };

  if(showAdmin){
    if(!auth){
      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
          <div className="bg-white text-black p-8 rounded-2xl w-full max-w-sm">
            <h1 className="text-2xl font-bold">SULTAN Admin</h1>
            <p className="text-sm text-gray-500 mb-4">Enter Admin Password</p>
            <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="Password" className="w-full border p-3 rounded-xl mb-3" />
            <button onClick={login} className="w-full bg-[#C9A86A] text-black py-3 rounded-xl font-bold">Login</button>
            <button onClick={()=>setShowAdmin(false)} className="w-full mt-3 text-sm">← Back to Site</button>
          </div>
        </div>
      );
    }
    return <Admin onBack={()=>{setShowAdmin(false); setAuth(false); setPwd('');}} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-[#C9A86A]/20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3"><img src="/Logo2.png" className="w-10 h-10 invert" alt="logo"/><div><h1 className="font-bold tracking-widest">SULTAN</h1><p className="text-xs text-[#C9A86A]">سلطان</p></div></div>
        <div className="flex gap-2">
          <button onClick={()=>setShowAdmin(true)} className="bg-white text-black px-5 py-2 text-sm font-bold rounded-full">ADMIN</button>
          {/* <button className="bg-[#C9A86A] text-black px-5 py-2 text-sm font-bold rounded-full">ALL OVER KARACHI</button> */}
        </div>
      </nav>

      <section className="px-6 py-20 text-center max-w-6xl mx-auto">
        <img src="/Logo2.png" className="w-40 mx-auto invert mb-8" alt="SULTAN"/>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">SULTAN <span className="text-[#C9A86A]">سلطان</span></h1>
        <p className="text-xl mt-4 text-gray-300">Karachi's Trusted Real Estate | <span className="text-[#C9A86A] font-bold">ALL OVER KARACHI</span></p>
        
        {/* ADVANCED SEARCH WITH SUGGESTIONS */}
        <div className="mt-10 bg-white/5 border border-[#C9A86A]/30 rounded-2xl p-6 max-w-3xl mx-auto relative">
          <p className="text-sm text-[#C9A86A] mb-3 tracking-widest">LEGAL MAP VERIFICATION - ALL OVER KARACHI</p>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input value={plotNo} onChange={e=>setPlotNo(e.target.value.toUpperCase())} placeholder="Plot No - jaise R-126" className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-[#C9A86A]/50" />
              {plotNo.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-[#111] border border-[#C9A86A]/20 rounded-xl overflow-hidden z-50 shadow-2xl">
                  {demoProps.filter(p=>p.plotNo.includes(plotNo)).slice(0,5).map(p=>(
                    <div key={p.plotNo} onClick={()=>{setPlotNo(p.plotNo); setCurrentImg(0); setSelectedProp(p);}} className="px-5 py-3 hover:bg-[#C9A86A]/10 cursor-pointer flex justify-between items-center border-b border-white/5 last:border-0">
                      <div><p className="font-bold text-sm">{p.plotNo} - {p.title}</p><p className="text- text-gray-400">{p.area} • {p.location}</p></div>
                      <span className={`text- px-2 py-1 rounded-full ${p.verificationStatus==='verified'?'bg-green-900/30 text-green-400':'bg-yellow-900/30 text-yellow-400'}`}>{p.verificationStatus}</span>
                    </div>
                  ))}
                  {demoProps.filter(p=>p.plotNo.includes(plotNo)).length === 0 && <div className="px-5 py-3 text-sm text-gray-500">No property - Try R-126</div>}
                </div>
              )}
            </div>
            <button onClick={()=>{const f=demoProps.find(p=>p.plotNo===plotNo); if(f){setCurrentImg(0); setSelectedProp(f);} else alert('Property nahi mili');}} className="bg-[#C9A86A] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#D4B87A]">VERIFY MAP</button>
          </div>
          <p className="text- text-gray-500 mt-3">Type House no# • {demoProps.length} Properties</p>
        </div>
      </section>

      <section className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold">Featured Properties <span className="text-[#C9A86A] text-sm ml-3">ALL OVER KARACHI - {demoProps.length} Properties</span></h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {demoProps.map(p=><div key={p.plotNo} onClick={()=>{setCurrentImg(0); setSelectedProp(p);}} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-[#C9A86A]/50">
            <div className="h-40 bg-gradient-to-br from-[#C9A86A]/20 to-transparent rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {p.mainImage ? <img src={p.mainImage} className="w-full h-full object-cover" /> : <span className="text-2xl font-black">{p.plotNo}</span>}
            </div>
            <p className="font-bold">{p.plotNo} - {p.area}</p>
            <p className="text-[#C9A86A]">{p.price}</p>
            <p className="text- text-gray-500 mt-1">{p.location} • {p.images?.length || 0} Pics</p>
          </div>)}
        </div>
      </section>

      {selectedProp && (
        <div className="fixed inset-0 bg-black/95 z-[100] overflow-y-auto p-4">
          <div className="max-w-5xl mx-auto bg-[#111] rounded-2xl overflow-hidden mt-6 border border-[#C9A86A]/30">
            <div className="p-5 flex justify-between items-center bg-black border-b border-[#C9A86A]/20">
              <div>
                <h2 className="font-black text-xl tracking-widest">{selectedProp.plotNo} - {selectedProp.title}</h2>
                <p className="text-xs text-[#C9A86A]">{selectedProp.location || 'ALL OVER KARACHI'} • {selectedProp.fullAddress || ''}</p>
              </div>
              <button onClick={()=>setSelectedProp(null)} className="bg-white text-black w-10 h-10 rounded-full font-bold">X</button>
            </div>
            <div className="grid md:grid-cols-2">
              <div className="p-5">
                <img src={selectedProp.images?.[currentImg]?.url || selectedProp.mainImage || 'https://via.placeholder.com/600'} className="w-full h- object-cover rounded-2xl border border-white/10" />
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {(selectedProp.images || []).slice(0,10).map((img,i)=>
                    <img key={i} src={img.url} onClick={()=>setCurrentImg(i)} className={`h-16 w-full object-cover rounded-xl cursor-pointer border-2 ${currentImg===i?'border-[#C9A86A]':'border-transparent opacity-70'}`} />
                  )}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-3xl font-black text-[#C9A86A]">{selectedProp.price}</h3>
                  <p className="font-bold">{selectedProp.area} • {selectedProp.propertyType || 'House'}</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedProp.bedrooms ? `${selectedProp.bedrooms} Bed • ` : ''}{selectedProp.bathrooms ? `${selectedProp.bathrooms} Bath` : ''}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                  <p className="text-xs tracking-widest text-[#C9A86A] mb-2">DESCRIPTION</p>
                  <p className="text-sm text-gray-300 leading-relaxed">{selectedProp.description || 'SULTAN - Karachi ki trusted real estate.'}</p>
                </div>
                {selectedProp.features && (
                  <div className="bg-white/[0.03] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs tracking-widest text-[#C9A86A] mb-2">FEATURES</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(selectedProp.features) ? selectedProp.features : selectedProp.features.split(',')).map((f,i)=><span key={i} className="bg-black border border-[#C9A86A]/30 text-xs px-3 py-1 rounded-full">{f}</span>)}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-black border border-white/5 p-3 rounded-xl"><p className="text-gray-500">Owner</p><p className="font-bold">{selectedProp.ownerName || 'SULTAN'}</p></div>
                  <div className="bg-black border border-white/5 p-3 rounded-xl"><p className="text-gray-500">Contact</p><p className="font-bold">{selectedProp.ownerContact || '0300-xxxxxxx'}</p></div>
                  <div className="bg-black border border-white/5 p-3 rounded-xl"><p className="text-gray-500">KDA</p><p className="font-bold text-[#C9A86A]">{selectedProp.kdaAllotment || selectedProp.legalMaps?.kda?.allotmentNo || 'Pending'}</p></div>
                  <div className="bg-black border border-white/5 p-3 rounded-xl"><p className="text-gray-500">SBCA NOC</p><p className="font-bold text-[#C9A86A]">{selectedProp.sbcaNoc || selectedProp.legalMaps?.sbca?.nocNumber || 'Pending'}</p></div>
                  <div className="col-span-2 bg-black border border-white/5 p-3 rounded-xl"><p className="text-gray-500">Survey No</p><p className="font-bold">{selectedProp.surveyNo || selectedProp.legalMaps?.survey?.surveyNo || 'Pending'}</p></div>
                </div>
                <div className="bg-gradient-to-r from-[#C9A86A]/10 to-transparent border border-[#C9A86A]/30 p-3 rounded-xl">
                  <p className="text- tracking-widest text-[#C9A86A]">LEGAL MAP VERIFICATION - ALL OVER KARACHI</p>
                  <div className="flex gap-2 mt-2 text- flex-wrap">
                    <span className={`px-2 py-1 rounded border ${selectedProp.legalMaps?.kda?.verified || selectedProp.kdaAllotment ? 'bg-green-900/30 text-green-400 border-green-500/20' : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20'}`}>KDA {selectedProp.legalMaps?.kda?.verified || selectedProp.kdaAllotment ? '✓ Verified' : '⏳ Pending'}</span>
                    <span className={`px-2 py-1 rounded border ${selectedProp.legalMaps?.sbca?.verified || selectedProp.sbcaNoc ? 'bg-green-900/30 text-green-400 border-green-500/20' : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20'}`}>SBCA {selectedProp.legalMaps?.sbca?.verified || selectedProp.sbcaNoc ? '✓ Verified' : '⏳ Pending'}</span>
                    <span className={`px-2 py-1 rounded border ${selectedProp.legalMaps?.survey?.surveyNo || selectedProp.surveyNo ? 'bg-green-900/30 text-green-400 border-green-500/20' : 'bg-yellow-900/30 text-yellow-400 border-yellow-500/20'}`}>Survey {selectedProp.legalMaps?.survey?.surveyNo || selectedProp.surveyNo ? '✓' : '⏳'}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {selectedProp.legalMaps?.kda?.imageUrl && <a href={selectedProp.legalMaps.kda.imageUrl} target="_blank" className="text- bg-[#C9A86A] text-black px-3 py-1 rounded-full font-bold">View KDA Map</a>}
                    {selectedProp.legalMaps?.sbca?.imageUrl && <a href={selectedProp.legalMaps.sbca.imageUrl} target="_blank" className="text- bg-white text-black px-3 py-1 rounded-full font-bold">View SBCA NOC</a>}
                    {selectedProp.legalMaps?.survey?.imageUrl && <a href={selectedProp.legalMaps.survey.imageUrl} target="_blank" className="text- bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20">View Survey</a>}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <a href={`https://wa.me/92${(selectedProp.ownerContact || '3001234567').replace(/[^0-9]/g,'').slice(-10)}`} target="_blank" className="flex-1 bg-green-600 text-center py-4 rounded-full font-black text-sm">WHATSAPP</a>
                  <button onClick={()=>setSelectedProp(null)} className="flex-1 bg-[#C9A86A] text-black py-4 rounded-full font-black text-sm">CLOSE</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <footer className="py-10 text-center border-t border-[#C9A86A]/20 mt-20"><p className="text-[#C9A86A]">سلطان - ALL OVER KARACHI - RealState - Verified</p></footer>
    </div>
  )
}