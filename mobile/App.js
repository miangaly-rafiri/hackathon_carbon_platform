
import React,{useState} from 'react'
import {View,Text,TextInput,Button} from 'react-native'

export default function App(){

 const [name,setName]=useState("")
 const [result,setResult]=useState("")

 async function create(){

  const r = await fetch("http://localhost:8080/api/sites",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    name:name,
    surface:1000,
    parkingSpaces:50,
    energyMWh:200,
    employees:100
   })
  })

  const data=await r.json()

  setResult(data.totalCO2)

 }

 return(

 <View style={{marginTop:60,padding:20}}>

 <Text>Create Site</Text>

 <TextInput
 placeholder="name"
 onChangeText={setName}
 />

 <Button title="Send" onPress={create}/>

 <Text>CO2 result: {result}</Text>

 </View>

 )

}
