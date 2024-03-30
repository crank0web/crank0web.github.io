import {local,signal,createApp,ref} from '/env.mjs'

new class{
	siteurl="https://z.c-rank.online"
	site="cr"
	menu=ref([])
	main=ref(null)
	methods={

	}
	constructor(){
		local.app=this
		createApp({
			methods:this.methods,
			setup:e=>this.setup(),
			mounted:e=>this.mounted()
		}).mount(".app")
	}
	setup(){
		return{
			menu:this.menu,
			main:this.main
		}
	}
	async mounted(){
		var {code}=await this.xget("/signon")
		if(code==200){
			this.menu.value=await this.xget("/aside")
			await this.load("home","/page/home.htm")
		}else{
			this.menu.value=[]
			await this.load("signin","/page/signin.htm")
		}
	}
	load(name,url){
		var task=new Promise((resolve,reject)=>{
			var x=new XMLHttpRequest()
			x.responseType="document"
			x.open("GET",url,true)
			x.onload=e=>resolve(x.response)
			x.onerror=reject
			x.send()
		})
		return new Promise(async(resolve,reject)=>{
			var body=await task
			var src=document.createElement("script")
			signal.set(name,e=>{
				var el=body.querySelector("div")
				var app=createApp(e)
				app.mount(el)
				this.main.value.appendChild(el)
				signal.delete(name)
				resolve(app)
			})
			this.main.value.appendChild(body.querySelector("style"))
			src.type="module"
			src.text=body.querySelector("script").text
			this.main.value.appendChild(src)
		})
	}
	async get(url){
		var res=await fetch(url)
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	async xget(url){
		var res=await fetch(this.siteurl+url,{
			credentials: "include"
		})
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	async xpost(url,obj){
		var res=await fetch(this.siteurl+url,{
			credentials: "include",
			method:"POST",
			body:JSON.stringify({
				site:this.site,
				...obj
			})
		})
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
	runScript(node,script){
		var src=document.createElement("script")
		src.type="module"
		src.text=script.text
		node.appendChild(src)
		script.remove()
	}
}
