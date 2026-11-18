// "Rp6.000": no space after "Rp" (AC-01.1). Intl's IDR currency style would give "Rp 6.000" with a no-break space.
export const formatRupiah = (amount) => `Rp${amount.toLocaleString('id-ID')}`
