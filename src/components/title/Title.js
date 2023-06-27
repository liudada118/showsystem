import React from 'react'

import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Input, Menu, Dropdown, Space, Slider } from 'antd';
import { useState } from 'react';
import { Select } from "element-react";
import "element-theme-default";
import option from '../../assets/images/Option.png'
import './title.scss'

const navItems = [
  {
    label: '实时',
    key: 'now',
  },
  {
    label: '回放',
    key: 'playback',
  },
];

const carItems = [
  {
    label: '整体',
    key: 'all',
  },
  {
    label: '靠背',
    key: 'back',
  },
  {
    label: '座椅',
    key: 'sit',
  },
];

const sitItems = [
  {
    label: <a href="https://www.antgroup.com">1st menu item</a>,
    key: '0',
  },
  {
    label: <a href="https://www.aliyun.com">2nd menu item</a>,
    key: '1',
  },
  {
    type: 'divider',
  },
  {
    label: '3rd menu item',
    key: '3',
  },
];

const sensorArr = [
  { name: '脚型检测', info: 'foot' },
  { name: '手部检测', info: 'hand' },
  { name: '汽车座椅', info: 'car' },
]

const Title = (props) => {

  const [port, setPort] = useState([])
  const [show, setShow] = useState(false)
  const [valueg1, setValueg1] = useState(2)
  const [valuej1, setValuej1] = useState(200)
  const [valuel1, setValuel1] = useState(2)
  const [valuef1, setValuef1] = useState(2)
  const [value1, setValue1] = useState(2)
  const [valuelInit1, setValuelInit1] = useState(2)
  const [current, setCurrent] = useState('now');
  const [carCurrent, setCarCurrent] = useState('all');

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const onClick = (e) => {
    console.log('click ', e.key);
    if (e.key === 'now') {
      props.changeLocal(false)
    } else {
      props.changeLocal(true)

    }
    setCurrent(e.key);
  };

  const onCarClick = (e) => {
    if (e.key === 'sit') {
      setCarCurrent('sit')
      props.com.current?.actionSit()
    } else if (e.key === 'back') {
      setCarCurrent('back')
      props.com.current?.actionBack()
    } else {
      setCarCurrent('all')
      props.com.current?.actionAll()
    }
  }
  return <div className="title">
    <h2>bodyta</h2>
    <div className="titleItems">
      <Select
        // value={sensorArr}
        // defaultValue={'汽车座椅'}
        placeholder="请选择对应传感器"
        onChange={(e) => {
          // props.handleChangeCom(e);
          console.log(e.info);
          props.wsSendObj({ file: e.info })
          props.changeMatrix(e.info)
          // props.changeDateArr(e.info)
          // if (ws && ws.readyState === 1)
          //   ws.send(JSON.stringify({ sitPort: e }));
        }}
      >
        {sensorArr.map((el) => {
          return (
            <Select.Option
              key={el.name}
              label={el.name}
              value={el}
            />
          );
        })}
      </Select>

      <Menu className='menu' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={navItems} />
      {!props.local ? <Select
        value={props.portname}
        placeholder={!props.local ? "请选择对应选项" : "请选择回放数据时间"}
        onChange={(e) => {
          // props.handleChangeCom(e);
          console.log(e);
          props.wsSendObj({ port: e })
          // if (ws && ws.readyState === 1)
          //   ws.send(JSON.stringify({ sitPort: e }));
        }}
      >
        {props.port.map((el) => {
          return (
            <Select.Option
              key={el.path}
              label={el.path}
              value={el.path}
            />
          );
        })}
      </Select> : <Select
        value={props.dataArr}
        placeholder={!props.local ? "请选择对应选项" : "请选择回放数据时间"}
        onChange={(e) => {
          // props.handleChangeCom(e);
          console.log(e);
          props.wsSendObj({ getTime: e, index: 0 })
          // props.wsSendObj({port : e})
          // if (ws && ws.readyState === 1)
          //   ws.send(JSON.stringify({ sitPort: e }));
        }}
      >
        {props.dataArr.map((el) => {
          return (
            <Select.Option
              key={el}
              label={el}
              value={el}
            />
          );
        })}
      </Select>}

      {props.matrixName == 'car' ?

        // <div style={{ display: 'flex' }}>
        //   <div className='aniButton' onClick={() => props.com.current?.actionBack()}>back</div>
        //   <div className='aniButton' onClick={() => props.com.current?.actionSit()}>sit</div>
        //   <div className='aniButton' onClick={() => props.com.current?.actionAll()}>all</div>
        // </div> 
        <Menu className='menu' onClick={onCarClick} selectedKeys={[carCurrent]} mode="horizontal" items={carItems} />
        : null}
    </div>
    <div style={{ position: 'relative' }}>
      <img onClick={() => { setShow(!show) }} className='optionImg' src={option} alt="" />
      {
        show ? <div className='slideContent' style={{ position: 'absolute', width: '300px', padding: '20px', backgroundColor: 'rgba(21,18,42,0.8)', borderRadius: '20px', right: 0, zIndex: 100 }}>
          <div
            className="flexcenter"
            style={{
              flex: 1,
              flexDirection: "column",
            }}
          >

            <div
              className="progerssSlide"
              style={{
                display: "flex",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                }}
              >
                润滑
              </div>
              <Slider
                min={0.1}
                max={8}
                onChange={(value) => {
                  localStorage.setItem("chairValuegGl", value);
                  setValueg1(value);
                  props.com.current?.sitValue({
                    valueg: value,
                  });
                  props.com.current?.backValue({
                    valueg: value,
                  });
                }}
                value={valueg1}
                step={0.1}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>
            <div
              className="progerssSlide"
              style={{
                display: "flex",
                alignItems: "center",
                //   padding : '5px',
                //   borderRadius : 10,
                //   backgroundColor : '#72aec9'
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                  // backgroundColor : '#6397ae' ,
                  //  padding : 5,borderRadius : '5px 10px',
                }}
              >
                颜色
              </div>
              <Slider
                min={5}
                max={2000}
                onChange={(value) => {
                  localStorage.setItem("chairValuejGl", value);
                  setValuej1(value);
                  props.com.current?.sitValue({
                    valuej: value,
                  });
                  props.com.current?.backValue({
                    valuej: value,
                  });
                }}
                value={valuej1}
                step={10}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>
            <div
              className="progerssSlide"
              style={{
                display: "flex",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                }}
              >
                过滤值{" "}
              </div>
              <Slider
                min={1}
                max={500}
                onChange={(value) => {
                  localStorage.setItem("chairValuefGl", value);
                  setValuef1(value);
                  props.com.current?.sitValue({
                    valuef: value,
                  });
                  props.com.current?.backValue({
                    valuef: value,
                  });
                }}
                value={valuef1}
                step={2}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>

            <div
              className="progerssSlide"
              style={{
                display: "flex",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                }}
              >
                高度
              </div>
              <Slider
                min={0.1}
                max={15}
                onChange={(value) => {
                  localStorage.setItem("chairValueGl", value);
                  setValue1(value);
                  props.com.current?.sitValue({
                    value: value,
                  });
                  props.com.current?.backValue({
                    value: value,
                  });
                }}
                value={value1}
                step={0.02}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>
            <div
              className="progerssSlide"
              style={{
                display: "flex",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                }}
              >
                数据连贯性{" "}
              </div>
              <Slider
                min={1}
                max={20}
                onChange={(value) => {
                  localStorage.setItem("chairValuelGl", value);
                  setValuel1(value);
                  props.com.current?.sitValue({
                    valuel: value,
                  });
                  props.com.current?.backValue({
                    valuel: value,
                  });
                }}
                value={valuel1}
                step={1}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>

            <div
              className="progerssSlide"
              style={{
                display: "flex",

                alignItems: "center",
              }}
            >
              <div
                style={{
                  color: "#468493",
                  minWidth: "80px",
                  textAlign: "left",
                }}
              >
                初始值{" "}
              </div>
              <Slider
                min={1}
                max={10000}
                onChange={(value) => {
                  localStorage.setItem("chairValueInitGl1", value);
                  setValuelInit1(value);
                  props.com.current?.sitValue({
                    valuelInit: value,
                  });
                  props.com.current?.backValue({
                    valuelInit: value,
                  });
                }}
                value={valuelInit1}
                step={500}
                // value={props.}
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </div> : <div></div>
      }
    </div>




  </div>
    ;
};
export default Title;