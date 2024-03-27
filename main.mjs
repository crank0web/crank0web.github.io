new class{
	siteurl="https://z.c-rank.online"
	#aside
	#main
	set aside(html){
		this.#aside.innerHTML=html
		for(var src of this.#aside.querySelectorAll("script")){
			this.#aside.appendChild(src)
		}
	}
	set main(html){
		this.#main.innerHTML=html
		for(var src of this.#main.querySelectorAll("script")){
			this.#main.appendChild(src)
		}
	}
	constructor(){
		this.init()
	}
	async init(){
		var dom=document.body.querySelectorAll("aside,main")
		this.#aside=dom[0]
		this.#main=dom[1]

		var {code}=await this.xget("/signon")
		if(code==200){
			this.aside=await this.xget("/aside")
			this.main=await this.get("/page/home.htm")
		}else{
			this.aside=""
			this.main=await this.get("/page/signin.htm")
		}
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
		var res=await fetch(this.siteurl+url)
		var text=await res.text()
		try{
			return JSON.parse(text)
		}catch(e){}
		return text
	}
}
