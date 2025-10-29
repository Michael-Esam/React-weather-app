import * as React from 'react';
import './App.css'
import axios from 'axios';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import WbCloudyIcon from '@mui/icons-material/WbCloudy';
import Button from '@mui/material/Button';
import { useEffect , useState } from 'react';
import moment from 'moment/moment';
import "moment/min/locales"
import { useTranslation } from 'react-i18next';

const theme = createTheme({
  typography:{
    fontFamily:["cairo"]
  }
});

let cancel = "";

function App() {
  const [lang , setLang] = useState("en")
  const { t, i18n } = useTranslation();
  
  
  const[date,setDate]=useState()
  
  
  const [temp , setTemp] = useState({
    temp:null,
    feelsLike:null,
    min:null,
    max:null,
    des:"",
    icon:""
  })
  
  // translate
  function ChangeLang (){
    if(lang === "en"){
      setLang("ar")
    localStorage.setItem("language","ar")
    }else {setLang("en")
    localStorage.setItem("language","en")
    }
  }
  useEffect(()=>{
    i18n.changeLanguage(lang)
    moment.locale(lang);
        // Date and time
        setDate(moment().format('LLLL'));
  },[lang])
  
  useEffect(()=>{
    if(localStorage.getItem("language")){
      setLang(localStorage.getItem("language"))
    }
    // Make a request for a user with a given ID
    axios
        .get("https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=877d0252c844c848bab122409178343a",{cancelToken: new axios.CancelToken((c)=>{
        cancel= c
        })})
        .then(function (response) {
          // handle success
          setTemp({
            tempNow:Math.round(response.data.main.temp-272.15),
            feelsLike:Math.round(response.data.main.feels_like -272.15),
            min:Math.floor(response.data.main.temp_min -272.15),
            max:Math.ceil(response.data.main.temp_max -272.15),
            des:response.data.weather[0].description,
            icon:response.data.weather[0].icon
          })
          console.log(response);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        return() => cancel()
    },[])
  return (
    <div className='app' style={{direction:t("ltr")}}>
    <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
       
    <Card sx={{ minWidth: 275 ,backgroundColor:"rgb(28 52 91 /36%)" , color:"white", boxShadow:"0px 11px 1px rgba(0,0,0,0.05)" , fontWeight:"600"}}>
      <CardContent>

         {/* city and time */}
        <div>
          <Typography gutterBottom variant='h3' sx={{ fontSize: 30 }}>
          {t("Cairo")}
          </Typography>
          <Typography gutterBottom variant='h5' sx={{ fontSize: 14 ,fontWeight:"600"}}>
          {date}
          </Typography>

        </div>
        <hr />

        {/* degree */}

        <div style={{display:"flex"}}>
          <div style={{flex:"1"}}>
          <Typography gutterBottom variant='h3' sx={{ fontSize: 55,fontWeight:"500" , display:"flex",alignItems:"flex-end"}}>
          {temp.tempNow}
          <img src={`https://openweathermap.org/img/wn/${temp.icon}@2x.png`} alt=""  style={{width:"50px", height:"50px"}}/>
          </Typography>
          <Typography gutterBottom variant='h5' sx={{ fontSize: 16 ,fontWeight:"600", marginBottom:"20px",padding:"0"}}>
          {t(temp.des)}
          </Typography>
          <Typography gutterBottom variant='h5' sx={{ fontSize: 13 ,fontWeight:"600"}}>
          <span>{t("Min")} : {temp.min}</span>
          <span style={{margin:"15px"}}>|</span>
          <span>{t("Max")} : {temp.max}</span>
          </Typography>
          </div>

          <div style={{flex:"1"}}>
            <WbCloudyIcon sx={{fontSize:"10em"}} />
          </div>
        </div>
      </CardContent>
    </Card>
    <Button variant="text" onClick={ChangeLang} sx={{color:"#ffffff9e" ,fontSize:"11px",marginTop:"7px"}}>{t("Arabic")}</Button>
        </Container>
      </ThemeProvider>
    </div>
  )
}

export default App
