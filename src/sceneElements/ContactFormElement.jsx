import React from 'react'
import logoPngBlk from '../images/logo_black.png'
import '../sceneElements/contactFormStyles.css';

export default function ContactFormElement() {
  return (
      <div id={'contact-form'} className={'panel-3d'}>

        <div className="nav">
          {/* <a href="#" className="menu-activator"><i className="ion-ios-more"></i></a>*/}
          <a href="#" className="white link"><i className="ion-ios-redo-outline"></i><i className="ion-ios-redo hidden"></i></a>
          {/* <h6 className="text-link">RETURN TO BEGINNING</h6> */}
        </div>
        <div className="container">
          <div className="inner">
            <div className="panel panel-left">
              <div className="panel-content">
                <img src={logoPngBlk} className="logo" style={{ width: '20vw' }} />
                <div className="image-background">
                </div>
              </div>
            </div>
            <div className="panel panel-right">
              <div className="panel-content">
                <div className="form">
                  <h1>Let's chat!</h1>
                  <div className="group">
                    <input type="text" placeholder="Name" required />
                    {/*<span className="highlight"></span>*/}
                    {/*<label>Your name</label>*/}
                  </div>
                  <br />
                  <div className="group">
                    <input type="text" placeholder="Email" required />
                    {/*<span className="highlight"></span>*/}
                    {/*<label>Your email</label>*/}
                  </div>
                  <br />
                  <div className="group">
                    <textarea className="textArea" rows="4" cols="50" placeholder="Message" required />
                    {/*<span className="highlight"></span>*/}
                    {/*<label>Message</label>*/}
                  </div>
                  <br />
                  <a className="send-btn">Send</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="menu"></div>
      </div>    
  )
}



