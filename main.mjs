new class{
    siteurl="https://api.c-rank.online"
    xscript=/<script>(.*?)<\/script>/g
    #aside
    #main
    set aside(html){
        var script=[]
        this.#aside.innerHTML=html.replace(xscript,(_,src)=>script.push(src))
        for(var src of script){
            Function(src).call(this)
        }
    }
    set main(html){
        var script=[]
        this.#main.innerHTML=html.replace(xscript,(_,src)=>script.push(src))
        for(var src of script){
            Function(src).call(this)
        }
    }
    constructor(){
        this.init()
    }
    async init(){
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
