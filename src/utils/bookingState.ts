interface BookingState {
    tourId: string;
    packageId: string;
    hasBooking: boolean;
}

export const saveBookingState = (tourId: string, packageId: string) => {
    const bookings = JSON.parse(localStorage.getItem('tourBookings') || '[]');
    if (!bookings.some((b: BookingState) => b.tourId === tourId && b.packageId === packageId)) {
        bookings.push({ tourId, packageId, hasBooking: true });
        localStorage.setItem('tourBookings', JSON.stringify(bookings));
    }
};

export const hasUserBooked = (tourId: string, packageId: string): boolean => {
    const bookings = JSON.parse(localStorage.getItem('tourBookings') || '[]');
    return bookings.some(
        (b: BookingState) => b.tourId === tourId && b.packageId === packageId
    );
};