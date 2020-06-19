import React, { Component } from 'react';
import { 
  View, StyleSheet, Text,
} from 'react-native';
import { PagerDotIndicator, IndicatorViewPager } from 'rn-viewpager';
import BenefitTicket from '../BenefitTicket';

class BenefitPager extends Component {
  renderDotIndicator() {
    const { benefits } = this.props;
    return (
      <PagerDotIndicator 
        pageCount={benefits.length}
        dotStyle={styles.dot}
        selectedDotStyle={styles.selectedDot}
      />
    );
  }
  fetchOneBenefit = (id) => {
    const { benefitsM } = this.props;
    benefitsM.readOneBenefit(id);
  }
  render() {
    const { benefits = [], merchantLogo, users, noQty } = this.props;
    console.log('bnefits', benefits)
    return (
      <View style={styles.fill}>
        <IndicatorViewPager
          style={styles.fill}
          indicator={this.renderDotIndicator()}
        >
          {
            benefits.map((el, index) => 
              <View style={[styles.fill, styles.container]} key={index}>
                <BenefitTicket
                  gotoRedeem={this.props.gotoRedeem}
                  gotoPay={this.props.gotoPay}
                  user={{}}
                  benefit={el}
                  noQty={noQty}
                  merchantLogo={merchantLogo}
                  onClick={this.fetchOneBenefit}
                />
              </View>
            )
          }
        </IndicatorViewPager>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingTop: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .4)'
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 10,
  },
});

export default BenefitPager;