use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod x402_marketplace {
    use super::*;

    pub fn register_service(
        ctx: Context<RegisterService>,
        service_id: String,
        url: String,
        price_usdc: u64,
        description: String,
    ) -> Result<()> {
        let service = &mut ctx.accounts.service;
        service.owner = ctx.accounts.owner.key();
        service.service_id = service_id;
        service.url = url;
        service.price_usdc = price_usdc;
        service.description = description;
        service.success_count = 0;
        service.failure_count = 0;
        service.bump = ctx.bumps.service;
        Ok(())
    }

    pub fn update_trust_metrics(
        ctx: Context<UpdateTrustMetrics>,
        success: bool,
    ) -> Result<()> {
        let service = &mut ctx.accounts.service;
        if success {
            service.success_count = service.success_count.checked_add(1).unwrap();
        } else {
            service.failure_count = service.failure_count.checked_add(1).unwrap();
        }
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(service_id: String)]
pub struct RegisterService<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + Service::LEN,
        seeds = [b"service", service_id.as_bytes()],
        bump
    )]
    pub service: Account<'info, Service>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTrustMetrics<'info> {
    #[account(mut)]
    pub service: Account<'info, Service>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Service {
    pub owner: Pubkey,
    pub service_id: String,
    pub url: String,
    pub price_usdc: u64,
    pub description: String,
    pub success_count: u64,
    pub failure_count: u64,
    pub bump: u8,
}

impl Service {
    pub const LEN: usize = 32 + // owner
        4 + 64 + // service_id (String)
        4 + 256 + // url (String)
        8 + // price_usdc
        4 + 512 + // description (String)
        8 + // success_count
        8 + // failure_count
        1; // bump
}

