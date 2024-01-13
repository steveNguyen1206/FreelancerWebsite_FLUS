import React from 'react'
import styles from './footer.module.css'

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.overlapgroup}>
        <div className='row' style={{ margin:"0", display: "flex", height:"100%", width:"100%"}}>
          <div className='col' style={{display: "flex",alignItems:'center', justifyContent:"center"}}>
            <p className={styles.FLUS}>
              <span className={styles.text_wrapper}>
                FLUS
                <br />
              </span>
              <span className={styles.span}>
                <br />
                aaaaaaaaaaaaaa
              </span>
            </p>
          </div>
          <div className='col'  style={{display: "flex",alignItems:'center', justifyContent:"center"}}>
            <p className={styles.EXPLOREDocsPlugin}>
              <span className={styles.text_wrapper}>
                EXPLORE
                <br />
              </span>
              <span className={styles.text_wrapper_2}>
                <br />
              </span>
              <a
                href="https://www.realtimecolors.com/docs/about-realtime-colors?colors=130e01-fffaeb-ff8400-fff5d6-cf4307&amp;fonts=Poppins-Poppins"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.text_wrapper_3}>
                  Docs
                  <br />
                  <br />
                </span>
              </a>
              <a
                href="https://www.figma.com/community/plugin/1234060894101724457/Realtime-Colors"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.text_wrapper_3}>
                  Plugin
                  <br />
                  <br />
                </span>
              </a>
              <a
                href="https://www.realtimecolors.com/dashboard?colors=130e01-fffaeb-ff8400-fff5d6-cf4307&amp;fonts=Poppins-Poppins"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.text_wrapper_3}>
                  Dashboard template
                  <br />
                  <br />
                </span>
              </a>
              <a
                href="https://www.realtimecolors.com/blog-post?colors=130e01-fffaeb-ff8400-fff5d6-cf4307&amp;fonts=Poppins-Poppins"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.text_wrapper_3}>
                  Blog post <br />
                </span>
              </a>
            </p>
          </div>
          <div className='col'  style={{display: "flex",alignItems:'center', justifyContent:"center"}}>
            <p className={styles.LETsCONNECT}>
              <span className={styles.text_wrapper}>
                LET&#39;S CONNECT
                <br />
              </span>
              <span className={styles.text_wrapper_2}>
                <br />
              </span>
              <a
                href="https://www.realtimecolors.com/contact?colors=130e01-fffaeb-ff8400-fff5d6-cf4307&amp;fonts=Poppins-Poppins"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className={styles.text_wrapper_3}>
                  Contact me
                  <br />
                </span>
              </a>
              <span className={styles.text_wrapper_2}>
                <br />
              </span>
              <a href="https://www.youtube.com/@juxtopposed" rel="noopener noreferrer" target="_blank">
                <span className={styles.text_wrapper_3}>
                  YouTube
                  <br />
                </span>
              </a>
              <span className={styles.text_wrapper_2}>
                <br />
              </span>
              <a href="https://github.com/juxtopposed" rel="noopener noreferrer" target="_blank">
                <span className={styles.text_wrapper_3}>
                  GitHub
                  <br />
                </span>
              </a>
              <span className={styles.text_wrapper_2}>
                <br />
              </span>
              <a href="https://codepen.io/Juxtopposed" rel="noopener noreferrer" target="_blank">
                <span className={styles.text_wrapper_3}>CodePen</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer
