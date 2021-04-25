import React from 'react'
import {Layout} from 'antd';

const AntdFooter = Layout.Footer;

export default function Footer() {
  return (
    <AntdFooter style={{
      textAlign: 'center'
    }}>
      <span role="img" aria-label="">🚀 Developed by Qinglong Zhang<br></br></span>
    </AntdFooter>
  )
}
