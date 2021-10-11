import React, { useRef, useState, useEffect } from "react";
import { TouchableOpacity, View, Button, Text, ActivityIndicator, Dimensions, Modal, Image, ScrollView } from "react-native";
import { RNCamera as Camera } from "react-native-camera";
import RNTextDetector from "react-native-text-detector";
import ImageEditor from "@react-native-community/image-editor";
import BarcodeMask from 'react-native-barcode-mask';

const App = () => {

  const [isLoading, setisLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [textList, setTextList] = useState([]);
  const [imageUri, setimageUri] = useState('')

  useEffect(() => {
   imageUri && processImage()  
  }, [imageUri])

  const camRef = useRef()
console.log(Dimensions.get('screen').height, Dimensions.get('screen').width)

const idGenerator = () => {
    var S4 = () => {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}




  // @function to take picture from camera and set uri
  const takePicture = async () => {
    setisLoading(true)
    try {
      const options = {
        quality: 0.8,
        base64: true,
        fixOrientation: true,
        // height: Dimensions.get('screen').height, 
        // width : Dimensions.get('screen').width
      };
      // const cropData = {
      //   offset: {x: 600, y: 1250},
      //   size: {width: 1820, height: 1250},
      // };
      const data = await camRef.current.takePictureAsync(options);
      //const data = await camRef.current.takePictureAsync(options);
        // console.log('response', Object.keys(data));
         //console.log('response2', data.height, data.width);
         //console.log('response3', Dimensions.get('screen').height, Dimensions.get('screen').width);
        const url = await ImageEditor.cropImage(data.uri,{
          offset: {x:((data.height * 14.8809524)/100), y: ((data.width * 41.3359788)/100)},
          size: {width: ((data.width * 60.1851852)/100), height: ((data.height * 40.0019841)/100)},
        })
        //console.log('url', url)
      setimageUri(url)
      setisLoading(false)
    } catch (e) {
      console.warn(e);
    }
  };


  // @function to detect text from image
  const processImage = async () => {
    try {
      const visionResp = await RNTextDetector.detectFromUri(imageUri);
      //console.log('visionResp', visionResp);
      visionResp.forEach((item)=>{
      textList.push({text:item.text, id : idGenerator()})
    })
    setShowModal(true)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={{ 
      flex:1, 
      }}>
        <Modal
           visible={showModal}
           >
             <ScrollView style={{flex:1}}>
               <Image source={{uri: imageUri}} style={{height: 200, width: 200, alignSelf:'center'}} />
               <Button title='close' onPress={()=> setShowModal(false)}></Button>
               {
                 textList.map((obj) => {
                 return(<View key={obj.id}>
                   <Text>{obj.text}</Text>
                   </View>)} )
               }
               <Button title='remove all text' onPress={()=> setTextList([])}></Button>
             </ScrollView>
             </Modal> 
      <Camera
      style={{flexGrow:1}}
      ref = {camRef}
      type={Camera.Constants.Type.back}
          flashMode='off'
          autoFocus={Camera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
      >
        <BarcodeMask
         width={Dimensions.get('screen').width-100}
         height={320}
         />
           <View style={{ justifyContent: 'flex-end', alignItems: 'center', flex:1 }}>
             {
               isLoading ? <ActivityIndicator animating={isLoading} size='large' style={{alignSelf: 'center'}}/>
               : <TouchableOpacity style={{
                flex: 0,
                color: 'white',
                fontSize: 40,
                padding: 15,
                paddingHorizontal: 20,
                backgroundColor: 'blue',
                marginBottom: 50,
              }} onPress={()=>takePicture()}>
              <Text>capture</Text>
            </TouchableOpacity>
             }
            </View>
      </Camera>
    </View>
    
  )
}

export default App

