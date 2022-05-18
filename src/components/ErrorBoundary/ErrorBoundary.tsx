import { Component } from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import ErrorMessage from '../ErrorMessage';

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
    if (this.state.hasError) {
      return <ErrorMessage />;
    } else {
      return this.props.children;
    }
  }
}

export default withTranslation()(ErrorBoundary);
