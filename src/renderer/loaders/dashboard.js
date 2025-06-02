


export default async function dashboadLoader(){

    const user = await getUser();

    if(!user){
        return redirect('/login');
    }

    return null;

}