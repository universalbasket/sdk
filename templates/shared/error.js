export default function(mountPoint) {
    return {
        init() {
            mountPoint.innerHtml = `
                <div class="page">
                    <h2>We’re sorry. We can’t continue your purchase at the moment.</h2>
                    <p>You can retry or get in touch with us support&#64;example.com</p>
                </div>
            `;
        }
    };
}
