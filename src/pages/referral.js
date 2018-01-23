import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Section from '../components/Section';
import balanceReferralPreview from '../assets/balance-referral-preview.png';
import { downloadLatestRelease } from '../utils/api';
import { colors, responsive } from '../styles';

const SSection = styled(Section)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SSectionWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  @media screen and (${responsive.md.max}) {
    padding: 0 34px;
    flex-direction: column;
    justify-content: center;
  }
`;

const SHalf = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  @media screen and (${responsive.md.max}) {
    justify-content: center;
    width: 100%;
  }
`;

const SRight = styled(SHalf)`
  justify-content: flex-end;
`;

const SSubscribe = styled.div`
  margin-top: 100px;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media screen and (${responsive.sm.min}) {
    max-width: 420px;
  }
  @media screen and (${responsive.md.max}) {
    margin-top: 0;
  }
  @media screen and (${responsive.sm.min}) and (${responsive.md.max}) {
    display: flex;
    align-items: center;
    text-align: center;
  }
`;

const SSubTitle = styled.h2`
  font-size: 1.6em;
  letter-spacing: -0.25px;
  margin: 0 0 10px;
  @media screen and (${responsive.md.max}) {
    margin: 0 0 0;
    font-size: 1.5em;
    letter-spacing: -0.2px;
  }
`;

const STagline = styled.p`
  font-size: 1.125em;
  color: rgb(${colors.lighterBlue});
  line-height: 1.5555555556em;
  @media screen and (${responsive.md.max}) {
    margin: 12px auto 0 auto;
    font-size: 1.1875em;
    line-height: 1.47em;
    color: rgba(${colors.white}, 0.8);
  }
`;

const SAppPreview = styled.div`
  width: 400px;
  height: 590px;
  background: url(${balanceReferralPreview}) no-repeat;
  background-size: 100% 100%;
  @media screen and (${responsive.md.max}) {
    display: none;
  }
`;

class Referral extends Component {
  onReferral = e => {
    e.preventDefault();
    downloadLatestRelease();
  };
  render = () => {
    const layoutTheme = {
      fontWeight: '400',
      linkColor: colors.lightBlue,
      linkHover: colors.lightBlue,
      mobileToggleColor: colors.lightGrey,
      mobileToggleOpacity: '1',
      logoColor: colors.lightBlue,
      logoHover: colors.lightBlue
    };
    const name = this.props.pathContext.slug;
    const siteTitle = this.props.data.site.siteMetadata.title;
    const title = `Referral - ${siteTitle}`;
    return (
      <div>
        <Helmet
          title={title}
          meta={[{ name: 'twitter:title', content: title }, { name: 'og:title', content: title }]}
        />
        <Header theme={layoutTheme} />
        <SSection id={name} color={colors.navyBlue}>
          <SSectionWrapper>
            <SHalf>
              <SSubscribe>
                <SSubTitle>Subscribe to get updates on Balance product releases</SSubTitle>
                <STagline>
                  A free open source Mac app for checking multiple crypto exchanges such as
                  Coinbase, GDAX and Poloniex. Support for many other exchanges and full wallet
                  support coming soon.
                </STagline>
              </SSubscribe>
            </SHalf>
            <SRight>
              <SAppPreview />
            </SRight>
          </SSectionWrapper>
        </SSection>
      </div>
    );
  };
}

export default Referral;

export const query = graphql`
  query ReferralQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;