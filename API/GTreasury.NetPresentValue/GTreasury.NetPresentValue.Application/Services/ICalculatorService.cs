using GTreasury.NetPresentValue.Domain.Models;

namespace GTreasury.NetPresentValue.Application.Services
{
    public interface ICalculatorService
    {
        Task<IEnumerable<NpvResponse>> CalculateNetPresentValue(NpvRequest request);
    }
}
