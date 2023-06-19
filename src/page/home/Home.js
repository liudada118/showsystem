import React, { useEffect, useRef, useState } from 'react'
import Title from '../../components/title/Title'
import './index.scss'
import Canvas from '../../components/three/Three'
import CanvasHand from '../../components/three/hand'
import Aside from '../../components/aside/Aside'
import plus from '../../assets/images/Plus.png'
import minus from '../../assets/images/Minus.png'
import icon from '../../assets/images/Icon.png'
import icon1 from '../../assets/images/Icon_1.png'
import icon2 from '../../assets/images/Icon_2.png'
import icon3 from '../../assets/images/Icon_3.png'
import load from '../../assets/images/load.png'
import { findMax, findMin, } from '../../assets/util/util'
import { rainbowColors, rainbowTextColors } from "../../assets/util/color";
import { handLine, footLine } from '../../assets/util/line';
import { Slider } from 'antd'
let ws, xvalue = 0, yvalue = 0

class Com extends React.Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate() {
    return false
  }
  render() {
    console.log(this.props)
    return (
      <>{this.props.children}</>
    )
  }
}

let totalArr = [], wsMatrixName = 'foot'

export default function Home() {
  const com = useRef()
  const data = useRef()
  const [valueg1, setValueg1] = useState(2)
  const [valuej1, setValuej1] = useState(200)
  const [valuel1, setValuel1] = useState(2)
  const [valuef1, setValuef1] = useState(2)
  const [value1, setValue1] = useState(2)
  const [port, setPort] = useState([])
  const [portname, setPortname] = useState()
  const [matrixName, setMatrixName] = useState('foot')
  const [valuelInit1, setValuelInit1] = useState(2)
  const [length, setLength] = useState(0)
  const [local, setLocal] = useState(false)
  const [index, setIndex] = useState(0)
  const [xdata, setXdata] = useState(0)
  useEffect(() => {
    ws = new WebSocket(" ws://localhost:19999");
    ws.onopen = () => {
      // connection opened
      console.info("connect success");
    };
    ws.onmessage = (e) => {
      let jsonObject = JSON.parse(e.data);
      //处理空数组

      // if (jsonObject.backData != null) {
      //   this.setState({
      //     renderFlag: true,
      //   });

      //   let wsPointData = jsonObject.backData;

      //   if (!Array.isArray(wsPointData)) {
      //     console.log(wsPointData);
      //     wsPointData = JSON.parse(JSON.parse(wsPointData));
      //   }

      //   com.current?.backData({
      //     wsPointData: wsPointData,
      //   });

      // }

      if (jsonObject.sitData != null) {

        let wsPointData = jsonObject.sitData;
        // console.log(wsPointData)
        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData);
        }

        console.log(wsPointData)
        // for (let i = 0; i < 8; i++) {
        //   for (let j = 0; j < 32; j++) {
        //     [wsPointData[i * 32 + j], wsPointData[(15 - i) * 32 + j]] = [
        //       wsPointData[(15 - i) * 32 + j],
        //       wsPointData[i * 32 + j],
        //     ];
        //   }
        // }


        // let b = wsPointData.splice(0, 16 * 32)
        // wsPointData = wsPointData.concat(b)

        // for (let i = 0; i < 32; i++) {
        //   for (let j = 0; j < 8; j++) {
        //     [wsPointData[i * 32 + j], wsPointData[(i) * 32 + 15 - j]] = [
        //       wsPointData[(i) * 32 + 15 - j],
        //       wsPointData[i * 32 + j],
        //     ];
        //   }
        // }

        // let sitData = [],
        //   backData = [];
        // for (let i = 0; i < 32; i++) {
        //   for (let j = 0; j < 32; j++) {
        //     if (j < 16) {
        //       sitData.push(wsPointData[i * 32 + j]);
        //     } else {
        //       backData.push(wsPointData[i * 32 + j]);
        //     }
        //   }
        // }

        if (wsMatrixName == 'foot') {
          const { sitData, backData } = footLine(wsPointData)
          console.log(sitData, backData )
          com.current?.changeDataFlag();
          com.current?.sitData({
            wsPointData: sitData,
          });

          com.current?.backData({
            wsPointData: backData,
          });
        } else {
          // console.log('hand')
          wsPointData = handLine(wsPointData)
          // console.log(wsPointData.length)
          com.current?.sitData({
            wsPointData: wsPointData,
          });

        }



        const total = wsPointData.reduce((a, b) => a + b, 0)

        const mean = (total / 1024).toFixed(0)
        const max = findMax(wsPointData)
        const min = findMin(wsPointData.filter((a) => a > 10))
        const point = wsPointData.filter((a) => a > 10).length
        const area = point * 4

        data.current?.setMeanPres(mean)
        data.current?.setMinPres(min)
        data.current?.setMaxPres(max)
        data.current?.setPoint(point)
        data.current?.setArea(area)
        data.current?.setTotalPres(total)
        if (totalArr.length < 20) {
          totalArr.push(total)
        } else {
          totalArr.shift()
          totalArr.push(total)
        }
        data.current?.handleCharts(totalArr)
      }
      if (jsonObject.port != null) {
        setPort(jsonObject.port);
      }
      if(jsonObject.length != null){
        setLength(jsonObject.length)
      }
    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };



    // document.getElementById("fileInput").addEventListener("change", function (event) {
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.onload = function (e) {
    //     const contents = e.target.result;
    //     // 在这里可以对文件内容进行处理
    //     console.log(contents);
    //   };
    //   reader.readAsText(file);
    // });

  }, [])

  const getPath = (e) => {
    console.log(e, e.fullPath)
  }

  const wsSendObj = (obj) => {
    if (obj.port) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ sitPort: obj.port }));
      }
    }
    if (obj.flag) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ flag: obj.flag }));
      }
    }

    if (obj.local) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ local: obj.local }));
      }
    }
  }



  const changeMatrix = (e) => {
    console.log(e)
    setMatrixName(e)
    wsMatrixName = e
  }

  const changeLocal = (value) => {
    setLocal(value)
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ local: true }));
    }
  }

  return (
    <div className='home'>
      <div className="setIcons">
        <div className="setIconItem setIconItem1">
          <div className='setIcon marginB10' onClick={() => {

            xvalue++
            if (xvalue < 3) {
              com.current?.changeGroupRotate({ x: xvalue })
              console.log(xvalue)
            } else {
              xvalue = 0
              com.current?.changeGroupRotate({ x: xvalue })
            }
          }}>
            <img src={plus} alt="" />
          </div>
          <div className='setIcon' onClick={() => {
            yvalue++
            if (yvalue < 3) {
              com.current?.changeGroupRotate({ y: yvalue })
              console.log(yvalue)
            } else {
              yvalue = 0
              com.current?.changeGroupRotate({ y: yvalue })
              console.log(yvalue)
            }
          }}>
            <img src={minus} alt="" />
          </div>
        </div>

        <div className="setIconItem setIconItem2">
          <div className='setIcon'>
            <img src={icon} alt="" onClick={() => {
              com.current?.reset()
            }} />
          </div>
        </div>

        <div className="setIconItem setIconItem2">
          <div className='setIcon marginB10' onClick={() => {
            console.log('load')
            wsSendObj({ flag: true })
          }}>
            <img src={load} alt="" />
          </div>
          <div className='setIcon marginB10' onClick={() => {
            console.log('load')
            wsSendObj({ local: true })
          }}>
            <img src={icon1} alt="" />
          </div>
          <div className='setIcon'>
            <img src={icon2} alt="" />
            {/* <input type="file" id='fileInput' onChange={(e) => getPath(e)}
            /> */}
          </div>

        </div>
      </div>


      <div style={{ position: 'fixed', display: 'flex', flexDirection: 'column', right: '3%', height: '55%', bottom: '6%', boxSizing: 'border-box', }}>
        {rainbowTextColors.slice(0, rainbowTextColors.length - 7).map((items, indexs) => {
          return (
            <div style={{ display: "flex", height: `${100 / rainbowTextColors.slice(0, rainbowTextColors.length - 7).length}%`, alignItems: 'center', padding: '3px', boxSizing: 'border-box' }}>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: 1,
                  padding: "0px 10px",
                }}
              >
                <div
                  className="switch"
                  style={{
                    color: "#ccc",
                    // minWidth: "80px",
                    textAlign: "left",
                  }}
                >
                  {(0.92 * ((rainbowTextColors.length - 1 - indexs)) / rainbowTextColors.length).toFixed(2)}N/cm^2
                </div>
                <div className="switchLevels"></div>
              </div>
              <div
                style={{
                  width: 50,
                  height: '100%',
                  backgroundColor: `rgb(${items})`,

                }}
              ></div>

            </div>
          );
        })}
      </div>
      <Title
        valueg1={valueg1}
        value1={value1}
        valuef1={valuef1}
        valuel1={valuel1}
        valuej1={valuej1}
        valuelInit1={valuelInit1}
        setValueg1={setValueg1}
        setValuej1={setValuej1}
        setValuef1={setValuef1}
        setValuel1={setValuel1}
        setValue1={setValue1}
        setValuelInit1={setValuelInit1}
        com={com}
        port={port}
        portname={portname}
        setPortname={setPortname}
        wsSendObj={wsSendObj}
        changeMatrix={changeMatrix}
        changeLocal={changeLocal}
      />
      <Aside ref={data} />
      {matrixName == 'foot' ? <Canvas ref={com} /> : <CanvasHand ref={com} />}

      {local ? <div style={{ position: "fixed", bottom: 0, width: '100%' }}>
        <Slider
          min={0}
          max={length - 2}
          onChange={(value) => {
            localStorage.setItem("localValuej", value);
            console.log(value)
            setIndex(value)
            if (ws && ws.readyState === 1) {
              // console.log(ws)
              ws.send(value)
            }
            //   can3.5pvas.valuej = value
          }}
          value={index}
          step={1}
          // value={}
          style={{ flex: 1 }}
        />
      </div> : null}
    </div>
  )
}
