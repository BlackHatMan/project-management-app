import { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';

type ErrorBoundaryPops = {
  children: React.ReactNode;
  t: TFunction;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryPops, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryPops) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return <h3>{t('ERROR_BOUNDARY_MSG')}</h3>;
    } else {
      return this.props.children;
    }
  }
}

export default withTranslation()(ErrorBoundary);
