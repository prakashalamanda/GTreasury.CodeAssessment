using GTreasury.NetPresentValue.Domain.Models;

namespace GTreasury.NetPresentValue.Tests.Builders;

public class NpvResponseBuilder
{
    private readonly List<NpvResponse> _responses = new();

    public NpvResponseBuilder WithResponse(decimal rate, decimal npv)
    {
        _responses.Add(new NpvResponse
        {
            DiscountRate = rate,
            NetPresentValue = npv
        });

        return this;
    }

    public NpvResponseBuilder WithDefaultResponses()
    {
        _responses.AddRange(
            [
                new NpvResponse { DiscountRate = 5.0m, NetPresentValue = 123.45m },
                new NpvResponse { DiscountRate = 6.0m, NetPresentValue = 110.00m }
            ]);

        return this;
    }

    public List<NpvResponse> BuildList() => _responses;
}
