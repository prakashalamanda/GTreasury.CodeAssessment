using GTreasury.NetPresentValue.Domain.Models;

namespace GTreasury.NetPresentValue.Tests.Builders;

public class NpvRequestBuilder
{
    private decimal _lowerBoundRate;
    private decimal _upperBoundRate;
    private decimal _incrementRate;
    private List<decimal> _cashFlows = new();

    public NpvRequestBuilder WithLowerBoundRate(decimal value)
    {
        _lowerBoundRate = value;
        return this;
    }

    public NpvRequestBuilder WithUpperBoundRate(decimal value)
    {
        _upperBoundRate = value;
        return this;
    }

    public NpvRequestBuilder WithIncrementRate(decimal value)
    {
        _incrementRate = value;
        return this;
    }

    public NpvRequestBuilder WithCashFlows(List<decimal> cashFlows)
    {
        _cashFlows = cashFlows;
        return this;
    }

    public NpvRequest Build()
    {
        return new NpvRequest
        {
            LowerBoundRate = _lowerBoundRate,
            UpperBoundRate = _upperBoundRate,
            IncrementRate = _incrementRate,
            CashFlows = _cashFlows
        };
    }
}
