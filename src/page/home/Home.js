import React, { useEffect, useRef, useState } from 'react'
import Title from '../../components/title/Title'
import './index.scss'
import Canvas from '../../components/three/Three'
import CanvasHand from '../../components/three/hand'
import CanvasCar from '../../components/three/car'
import Aside from '../../components/aside/Aside'
import plus from '../../assets/images/Plus.png'
import minus from '../../assets/images/Minus.png'
import icon from '../../assets/images/Icon.png'
import icon1 from '../../assets/images/Icon_1.png'
import icon2 from '../../assets/images/Icon_2.png'
import icon3 from '../../assets/images/Icon_3.png'
import load from '../../assets/images/load.png'
import stop from '../../assets/images/stop.png'
import play from '../../assets/images/play.png'
import pause from '../../assets/images/pause.png'
import { findMax, findMin, } from '../../assets/util/util'
import { rainbowColors, rainbowTextColors } from "../../assets/util/color";
import { handLine, footLine } from '../../assets/util/line';
import { Select, Slider } from 'antd'
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
  const [dataArr, setDataArr] = useState([])
  const [index, setIndex] = useState(0)
  const [playflag, setPlayflag] = useState(false)
  const [time, setTime] = useState([])
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

      if (jsonObject.sitData != null) {

        let wsPointData = jsonObject.sitData;
        // console.log(wsPointData)
        if (!Array.isArray(wsPointData)) {
          wsPointData = JSON.parse(wsPointData);
        }

        if (wsMatrixName == 'foot') {
          const { sitData, backData } = footLine(wsPointData)
          com.current?.changeDataFlag();
          com.current?.sitData({
            wsPointData: sitData,
          });

          com.current?.backData({
            wsPointData: backData,
          });
        } else {
          wsPointData = handLine(wsPointData)
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
      if (jsonObject.length != null) {
        setLength(jsonObject.length)
      }
      if (jsonObject.time != null) {
        setTime(jsonObject.time)
      }
      if (jsonObject.timeArr != null) {
        // const arr = []
        const arr = jsonObject.timeArr.map((a, index) => a.date)
        setDataArr(arr)
      }
      if (jsonObject.index != null) {
        setIndex(jsonObject.index)
      }

    };
    ws.onerror = (e) => {
      // an error occurred
    };
    ws.onclose = (e) => {
      // connection closed
    };

  }, [])

  const getPath = (e) => {
    console.log(e, e.fullPath)
  }

  const wsSendObj = (obj) => {

    if (obj.file) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ file: obj.file }));
      }
    }

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

    if (obj.getTime) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ getTime: obj.getTime }));
      }
    }

    if (obj.local) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ local: obj.local }));
      }
    }

    if (obj.time) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ time: obj.time }));
      }
    }

    if (obj.speed) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ speed: obj.speed }));
      }
    }

    if (obj.index != null) {
      if (ws && ws.readyState === 1) {
        ws.send(JSON.stringify({ index: obj.index }));
      }
    }


  }

  const playData = (value) => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ play: value }));
      setPlayflag(value)
    }
  }

  const changeMatrix = (e) => {
    console.log(e)
    setMatrixName(e)
    wsMatrixName = e
  }

  const changeDateArr = (matrixName) => {
    if (matrixName == 'foot') {
      const dataArr = localStorage.getItem('dataArr')
      const arr = dataArr ? JSON.parse(dataArr) : []
      setDataArr(arr)
    } else if (matrixName == 'hand') {
      const dataArr = localStorage.getItem('handArr')
      const arr = dataArr ? JSON.parse(dataArr) : []
      setDataArr(arr)
    } else if (matrixName == 'car') {
      const dataArr = localStorage.getItem('carArr')
      const arr = dataArr ? JSON.parse(dataArr) : []
      setDataArr(arr)
    }
  }

  const changeLocal = (value) => {
    setLocal(value)
    // changeDateArr(matrixName)

    if (ws && ws.readyState === 1) {
      if (value) {
        ws.send(JSON.stringify({ local: true }));
      } else {
        ws.send(JSON.stringify({ local: false }));
      }

    }
  }

  const formatter = (value) => {

    return `${value}%`
  };

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
            const date = new Date(Date.now());
            const formattedDate = date.toLocaleString();
            if (matrixName == 'foot') {
              const dataArr = localStorage.getItem('dataArr')
              const arr = dataArr ? JSON.parse(dataArr) : []
              arr.push(formattedDate)
              localStorage.setItem('dataArr', JSON.stringify(arr))
            } else if (matrixName == 'hand') {
              const dataArr = localStorage.getItem('handArr')
              const arr = dataArr ? JSON.parse(dataArr) : []
              arr.push(formattedDate)
              localStorage.setItem('handArr', JSON.stringify(arr))
            } else if (matrixName == 'car') {
              const dataArr = localStorage.getItem('handArr')
              const arr = dataArr ? JSON.parse(dataArr) : []
              arr.push(formattedDate)
              localStorage.setItem('handArr', JSON.stringify(arr))
            }


            wsSendObj({ flag: true, time: formattedDate })
          }}>
            <img src={load} alt="" />
          </div>
          <div className='setIcon marginB10' onClick={() => {
            console.log('load')
            wsSendObj({ flag: false })
          }}>
            <img src={stop} alt="" />
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
        local={local}
        dataArr={dataArr}
        matrixName={matrixName}
        setPortname={setPortname}
        wsSendObj={wsSendObj}
        changeMatrix={changeMatrix}
        changeLocal={changeLocal}
      // changeDateArr={changeDateArr}
      />
      <Aside ref={data} />
      {matrixName == 'foot' ? <Canvas ref={com} /> : matrixName == 'hand' ? <CanvasHand ref={com} /> : <CanvasCar ref={com} />}

      {local ?
        <div style={{ position: "fixed", bottom: 0, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', position: 'relative' }}>
            <Slider
              tooltip={{
                formatter,
              }}

              min={0}
              max={length - 2}
              onChange={(value) => {
                localStorage.setItem("localValuej", value);
                console.log(value)
                setIndex(value)
                if (ws && ws.readyState === 1) {
                  ws.send(JSON.stringify({ value }))
                }
              }}
              value={index}
              step={1}
              style={{ width: '100%' }}
            />
            <div>
              <img src={play} style={{ width: '50px', display: playflag ? 'none' : 'unset' }}
                onClick={() => { playData(true) }}
                alt="" />
              <img src={pause} style={{ width: '50px', display: playflag ? 'unset' : 'none' }}
                onClick={() => { playData(false) }}
                alt="" />
              <div style={{ position: 'absolute', bottom: 0, right: '20%' }}>
                <Select
                  defaultValue="1.0X"
                  style={{
                    width: 80,
                  }}
                  onChange={(e) => {
                    console.log(e)
                    wsSendObj({ speed: e })
                  }}

                  dropdownMatchSelectWidth={false}
                  placement={'topLeft'}
                  options={[
                    {
                      value: 1,
                      label: '1.0X',
                    },
                    {
                      value: 1.5,
                      label: '1.5X',
                    },
                    {
                      value: 2,
                      label: '2.0X',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div> : null}
    </div>
  )
}
