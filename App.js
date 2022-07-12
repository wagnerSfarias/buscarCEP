import React,{useState, useEffect, useRef} from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView,ImageBackground,Animated, Keyboard,Alert} from 'react-native';

import api from './src/services/api';
export default function App() {
  const[cep, setCep] = useState('');
  const[loading, setLoading] = useState(true);
  const [cepUser, setCepUser] = useState(null);
  const inputRef= useRef(null);
 
  const larAnimada = useRef(new Animated.Value(150)).current;
  const altAnimada = useRef(new Animated.Value(50)).current;
 
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(larAnimada, {
          toValue: 300,
          duration: 2000,
          useNativeDriver: false
        }),
        Animated.timing(larAnimada, {
          toValue: 150,
          duration: 2000,
          useNativeDriver: false
        })
      ])
    ).start();
    setTimeout(()=>{
     
     setLoading(false)
    },6000)
  
  },[])
  
  function clear(){
    setCep('');
    setCepUser(null);
    inputRef.current.focus();
 }
 async function search(){
  if(cep==''){
    Alert.alert(
      "Atenção",
      "Digite um CEP válido"
    )
    setCep('');
    setCepUser(null);
    inputRef.current.focus();
    return;
  }
       
  try{
   
    const response = await api.get(`/${cep}/json`);

    if(response.data.erro =='true'){
      Alert.alert(
        "Atenção",
        "Não encontramos o cep desejado, verifique se os números estão corretos."
      )
      setCep('');
      setCepUser(null);
      inputRef.current.focus();
      return;
    }
   
    setCepUser(response.data);
    setCep('')
    Keyboard.dismiss(); 

    }catch(error){
       Alert.alert("Atenção",'Error: CEP inválido, confira se digitou os números corretos, não insira caracteres apenas números.')
       setCep('');
       setCepUser(null);
       inputRef.current.focus();
       return;
  }
 
}
 
  if(loading){
    return(
    
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Animated.View style={{ 
          width: larAnimada,
          height: altAnimada,
          backgroundColor: '#294a87',
          justifyContent: 'center',
          borderRadius: 50}}>
        <Text  style={{ textAlign: 'center', fontSize: 22, color: '#FFF'}}>Carregando....</Text>
      </Animated.View>
      </View>
    )
  }else{

 return (
   <SafeAreaView style={styles.container}>
         <ImageBackground  
            source={require('./src/assets/fundo.jpg')} 
              style={styles.img} >

       <View style={{alignItems:'center'}}>
    
          <Text style={styles.title}>Digite o CEP desejado</Text>
          <TextInput style={styles.input} 
          placeholder="Ex: 12345000"
          maxLength={8}
          value={cep}
          keyboardType="numeric"
          ref={inputRef}
          onChangeText={(texto) => setCep(texto)}></TextInput>
             
      </View>
      
      <View style={styles.viewButton}>
         <TouchableOpacity style={[styles.button,{backgroundColor:'#590926'}]}
         onPress={search}>
           <Text style={styles.buttonText}>Buscar</Text>
         </TouchableOpacity>
         <TouchableOpacity style={[styles.button,{backgroundColor:'#294a87'}]}
         onPress={clear}>
           <Text style={styles.buttonText}>Limpar</Text>
         </TouchableOpacity>
      </View>

     {cepUser &&   
       <View style={styles.viewResult}>
        <Text style={styles.resultText}>CEP: {cepUser.cep}</Text>
        <Text style={styles.resultText}>Logradouro: {cepUser.logradouro}</Text>
        <Text style={styles.resultText}>Bairro: {cepUser.bairro}</Text>
        <Text style={styles.resultText}>Cidade: {cepUser.localidade}</Text>
        <Text style={styles.resultText}>Estado: {cepUser.uf}</Text>
       </View>
      
      }
    
      </ImageBackground> 
    </SafeAreaView>   
 
  );
}
}
const styles =StyleSheet.create({
container:{
  flex:1,
  justifyContent:'center',
  alignContent:'center',
},
img:{
  flex:1,
  resizeMode: "cover",
},
title:{
  marginTop:25,
  marginBottom:15,
  fontSize:25,
  fontWeight:'bold',
  color: '#000'
},
input:{
  backgroundColor:'#fff',
  borderWidth:1,
  borderColor:'#ddd',
  borderRadius:5,
  width: '90%',
  padding: 10,
  fontSize:18
},
viewButton:{
  alignItems:'center',
  marginTop:10,
  justifyContent:'space-around'
},
button:{
  height: 50,
  width: 200,
  justifyContent:'center',
  alignItems:'center',
  padding: 10,
  marginTop:15,
  borderRadius:5,
},
buttonText:{
  fontSize:20,
  color:'#fff',
  fontWeight:'bold'
},
viewResult:{ 
  backgroundColor:'rgba(52,52,52 , 0.6)',
  marginTop:80,
  paddingVertical: 10
},
resultText:{
  fontSize:22,
  color: '#fff',
  fontWeight:'bold',
  textAlign:'center'
}

})