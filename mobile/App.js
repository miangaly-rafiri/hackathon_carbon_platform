
import React,{useState} from 'react'
import {View,Text,TextInput,Button,ScrollView} from 'react-native'

export default function App(){

 const [name,setName]=useState("")
 const [surface,setSurface]=useState("1000")
 const [parkingSpaces,setParkingSpaces]=useState("50")
 const [energyMWh,setEnergyMWh]=useState("200")
 const [employees,setEmployees]=useState("100")
 const [concreteTons,setConcreteTons]=useState("120")
 const [steelTons,setSteelTons]=useState("25")
 const [glassTons,setGlassTons]=useState("18")
 const [woodTons,setWoodTons]=useState("12")
 const [result,setResult]=useState("")

 async function create(){

  const r = await fetch("http://localhost:8080/api/sites",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    name:name,
        surface:Number(surface),
        parkingSpaces:Number(parkingSpaces),
        energyMWh:Number(energyMWh),
        employees:Number(employees),
        concreteTons:Number(concreteTons),
        steelTons:Number(steelTons),
        glassTons:Number(glassTons),
        woodTons:Number(woodTons)
   })
  })

  const data=await r.json()

    setResult(`Total: ${data.totalCO2} kg | Construction: ${data.constructionCO2} kg | Exploitation: ${data.operationCO2} kg`)

 }

 return(

 <ScrollView style={{marginTop:60,padding:20}}>

 <Text style={{fontSize:22,fontWeight:'600',marginBottom:14}}>Saisie rapide site</Text>

 <TextInput
 placeholder="Nom"
 onChangeText={setName}
 value={name}
 style={{borderWidth:1,padding:10,marginBottom:10}}
 />

 <TextInput placeholder="Surface m²" keyboardType="numeric" onChangeText={setSurface} value={surface} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Parking" keyboardType="numeric" onChangeText={setParkingSpaces} value={parkingSpaces} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Énergie MWh/an" keyboardType="numeric" onChangeText={setEnergyMWh} value={energyMWh} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Employés" keyboardType="numeric" onChangeText={setEmployees} value={employees} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Béton (t)" keyboardType="numeric" onChangeText={setConcreteTons} value={concreteTons} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Acier (t)" keyboardType="numeric" onChangeText={setSteelTons} value={steelTons} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Verre (t)" keyboardType="numeric" onChangeText={setGlassTons} value={glassTons} style={{borderWidth:1,padding:10,marginBottom:10}} />
 <TextInput placeholder="Bois (t)" keyboardType="numeric" onChangeText={setWoodTons} value={woodTons} style={{borderWidth:1,padding:10,marginBottom:10}} />

 <Button title="Send" onPress={create}/>

 <Text style={{marginTop:16}}>Résultat: {result}</Text>

 </ScrollView>

 )

}
