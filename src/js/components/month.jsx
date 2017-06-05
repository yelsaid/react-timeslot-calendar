import React from 'react';
import PropTypes from 'prop-types';
import helpers from './../util/helpers';
import Week from './week.jsx';

export default class Month extends React.Component {
  constructor(props) {
    super(props);

    const {
      date,
      weeks,
    } = this.props;

    // find out staring week:
    const dateWithoutTime = date.startOf('day');
    let startingWeek  = 0;
    weeks.some((week, index) => {
      let weekContainsDate = week.some((day) => {
        const momentDay = helpers.getMomentFromCalendarJSDateElement(day);
        return momentDay.format() === dateWithoutTime.format();
      });

      if (weekContainsDate) {
        startingWeek = index;
        return weekContainsDate;
      }

    });

    this.state = {
      currentWeekIndex: startingWeek,
    };
  }

  render() {

    return (
      <div className = "tsc-month">
        { this._renderTitle() }
        { this._renderActions() }
        { this._renderWeek() }
      </div>
    );
  }

  _renderTitle() {
    const {
      date,
    } = this.props;

    return (
      <div className = "tsc-month__title">
        <span>{ date.format('MMMM') }</span>
      </div>
    );
  }

  _renderActions() {
    const {
      weeks,
    } = this.props;

    const {
      currentWeekIndex,
    } = this.state;

    const currentWeek = weeks[currentWeekIndex];
    const startDate = helpers.getMomentFromCalendarJSDateElement(currentWeek[0]);
    const endDate = helpers.getMomentFromCalendarJSDateElement(currentWeek[currentWeek.length - 1]);
    const actionTitle = `${startDate.format('MMM Do')} - ${endDate.format('MMM Do')}`;

    return (
      <div className = "tsc-month__actions">
        <div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--left" onClick = { this._onPrevWeekClicked.bind(this) }>
          &#8249;
        </div>
        <div className = "tsc-month__action tsc-month__action-title">
          { actionTitle }
        </div>
        <div className = "tsc-month__action tsc-month__action-element tsc-month__action-element--right" onClick = { this._onNextWeekClicked.bind(this) }>
          &#8250;
        </div>
      </div>
    );
  }

  _renderWeek() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      weeks,
    } = this.props;

    return (
      <Week
        weekToRender = { weeks[currentWeekIndex] }
        onTimeslotClick = { () => {} }
      />
    );
  }

  /**
   * Handles prev week button click.
   */
  _onPrevWeekClicked() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      onGoToPrevMonth,
    } = this.props;

    if (currentWeekIndex - 1 >= 0) {
      this.setState({
        currentWeekIndex: currentWeekIndex - 1,
      });
    }
    else if (onGoToPrevMonth) {
      onGoToPrevMonth();
    }
  }

  /**
   * Handles next week button click.
   */
  _onNextWeekClicked() {
    const {
      currentWeekIndex,
    } = this.state;

    const {
      weeks,
      onGoToNextMonth,
    } = this.props;

    if (currentWeekIndex + 1 < weeks.length) {
      this.setState({
        currentWeekIndex: currentWeekIndex + 1,
      });
    }
    else if (onGoToNextMonth) {
      onGoToNextMonth();
    }
  }
}

/**
* @type {Object} date: Base date to get the month from - Usually first day of the month
* @type {Array} weeks: A list of weeks based on calendarJS
* @type {Function} onGoToNextMonth: A callback to call when user goes out of the month to next month
* @type {Function} onGoToPrevMonth: A callback to call when user goes out of the month to prev month
 */
Month.propTypes = {
  date: PropTypes.object.isRequired,
  weeks: PropTypes.array.isRequired,
  onGoToNextMonth: PropTypes.func,
  onGoToPrevMonth: PropTypes.func,
};
