import { useEffect, useRef } from 'react'
import * as THREE from 'three'
export default function Background3D() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 200)
    camera.position.z = 30
    const renderer = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0xF8FAFF, 1)
    const geos = [new THREE.TorusGeometry(1.2,0.35,16,40),new THREE.OctahedronGeometry(1.1),new THREE.IcosahedronGeometry(1.0),new THREE.TetrahedronGeometry(1.3)]
    const shapes = []
    for (let i=0;i<18;i++) {
      const geo = geos[Math.floor(Math.random()*geos.length)]
      const wire = Math.random()>0.5
      const mat = wire
        ? new THREE.MeshBasicMaterial({color:0x4F8EF7,transparent:true,opacity:0.15,wireframe:true})
        : new THREE.MeshPhongMaterial({color:0x4F8EF7,transparent:true,opacity:0.08})
      const m = new THREE.Mesh(geo, mat)
      m.position.set((Math.random()-0.5)*60,(Math.random()-0.5)*40,(Math.random()-0.5)*30-5)
      const s=0.5+Math.random()*1.8; m.scale.set(s,s,s)
      m.userData={rx:(Math.random()-0.5)*0.004,ry:(Math.random()-0.5)*0.004,fs:0.0003+Math.random()*0.0005,fo:Math.random()*Math.PI*2}
      scene.add(m); shapes.push(m)
    }
    scene.add(new THREE.AmbientLight(0xffffff,0.8))
    const pl=new THREE.PointLight(0x4F8EF7,2,100); pl.position.set(10,10,10); scene.add(pl)
    let mx=0,my=0
    const onM=e=>{mx=(e.clientX/window.innerWidth-0.5)*0.5;my=(e.clientY/window.innerHeight-0.5)*0.5}
    window.addEventListener('mousemove',onM)
    const clock=new THREE.Clock(); let raf
    const animate=()=>{
      raf=requestAnimationFrame(animate)
      const t=clock.getElapsedTime()
      camera.position.x+=(mx*4-camera.position.x)*0.03
      camera.position.y+=(-my*3-camera.position.y)*0.03
      camera.lookAt(scene.position)
      shapes.forEach(m=>{m.rotation.x+=m.userData.rx;m.rotation.y+=m.userData.ry;m.position.y+=Math.sin(t*m.userData.fs*1000+m.userData.fo)*0.003})
      renderer.render(scene,camera)
    }
    animate()
    const onR=()=>{camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();renderer.setSize(window.innerWidth,window.innerHeight)}
    window.addEventListener('resize',onR)
    return ()=>{cancelAnimationFrame(raf);window.removeEventListener('mousemove',onM);window.removeEventListener('resize',onR);renderer.dispose()}
  },[])
  return <canvas ref={ref} style={{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:0,pointerEvents:'none'}}/>
}
