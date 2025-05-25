namespace GTreasury.NetPresentValue.Domain;

public static class NpvConstants
{
    public static class ErrorMessages
    {
        public const string CashFlowsRequired = "Cash flows are required.";
        public const string CashFlowsMinLength = "At least one cash flow is required.";
        public const string LowerBoundRateRange = "Lower bound rate must be between 0 and 100.";
        public const string UpperBoundRateRange = "Upper bound rate must be between 0 and 100.";
        public const string IncrementRateInvalid = "Increment rate value is invalid.";
        public const string LowerBoundLessThanUpperBound = "Lower bound rate must be less than or equal to upper bound rate.";
        public const string CalculationException = "An unexpected error occurred while processing your request. Details: {0}";
    }
}
