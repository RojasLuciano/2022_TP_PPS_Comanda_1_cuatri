export const authHandler = (user:any)=>{
    if(user.profile === "cliente" && user.status !== "Activo"){
        throw ({code:'unauthorized'})
    }
}